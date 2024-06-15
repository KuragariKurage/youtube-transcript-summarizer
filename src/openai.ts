import OpenAI from "openai";
import { OpenAIModel, PluginSettings } from "settings";

export class OpenAIClient {
	client: OpenAI;
	model: OpenAIModel;

	constructor(settings: PluginSettings) {
		this.client = new OpenAI({
			apiKey: settings.openAIApiKey,
			dangerouslyAllowBrowser: true,
		});
		this.model = settings.openAIModel;
	}

	async query(content: string): Promise<string> {
		const completion = await this.client.chat.completions.create({
			messages: [{ role: "assistant", content: content }],
			model: this.model,
		});

		const messageContent = completion.choices.at(0)?.message.content;
		if (messageContent) {
			return messageContent;
		} else {
			throw new Error("No message content found.");
		}
	}
}
