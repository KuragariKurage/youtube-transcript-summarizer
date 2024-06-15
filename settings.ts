export type OpenAIModel = "gpt-3.5-turbo" | "gpt-4-turbo" | "gpt-4o";
export const OPENAI_MODELS: OpenAIModel[] = [
	"gpt-3.5-turbo",
	"gpt-4-turbo",
	"gpt-4o",
];
export const OPENAI_MODEL_MAX_TOKENS: Record<OpenAIModel, number> = {
	"gpt-3.5-turbo": 16385,
	"gpt-4-turbo": 128000,
	"gpt-4o": 128000,
};

export interface PluginSettings {
	openAIApiKey: string;

	openAIModel: OpenAIModel;

	maxTokenSize: number;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	openAIApiKey: "",
	openAIModel: "gpt-4o",
	maxTokenSize: OPENAI_MODEL_MAX_TOKENS["gpt-4o"],
};
