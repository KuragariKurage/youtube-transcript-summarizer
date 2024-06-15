import { OpenAIClient } from "./openai";
import { YoutubeTranscriptLoader } from "./youtube";
import {
	SUMMARIZE_PROMPT_TEMPLATE,
	SUMMARY_MARKDOWN_TEMPLATE,
} from "./templates";
import { Document } from "@langchain/core/documents";

export class YoutubeTranscriptSummarizer {
	private readonly loader: YoutubeTranscriptLoader;
	constructor(private readonly OpenAIClient: OpenAIClient) {
		this.loader = new YoutubeTranscriptLoader();
	}

	async summarize(videoUrl: string): Promise<string> {
		const subtitles = await this.loader.loadTranscript(videoUrl);

		const query = this.constructPrompt(subtitles);

		const summary = await this.OpenAIClient.query(query);

		return this.transformToMarkdown(summary, subtitles);
	}

	private constructPrompt(subtitles: Document[]): string {
		return SUMMARIZE_PROMPT_TEMPLATE.replace(
			"{context}",
			subtitles.map((doc) => doc.pageContent).join("\n")
		);
	}

	private transformToMarkdown(
		content: string,
		documents: Document[]
	): string {
		const metadata = documents[0]?.metadata;

		return SUMMARY_MARKDOWN_TEMPLATE.replace("{title}", metadata?.title)
			.replace("{author}", metadata?.author)
			.replace("{publish_date}", metadata?.publishDate)
			.replace("{thumbnail_url}", metadata?.thumbnailUrl)
			.replace("{source}", metadata?.source)
			.replace("{summary}", content);
	}
}
