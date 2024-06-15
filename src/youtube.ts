import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { Document } from "@langchain/core/documents";

export class YoutubeTranscriptLoader {
	constructor() {}

	async loadTranscript(videoUrl: string): Promise<Document[]> {
		try {
			const loader = YoutubeLoader.createFromUrl(videoUrl, {
				language: "ja",
				addVideoInfo: true,
			});

			return await loader.load();
		} catch (error) {
			throw new Error(
				"Failed to load transcript: " + (error as Error).message
			);
		}
	}
}
