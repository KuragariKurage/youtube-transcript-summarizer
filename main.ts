import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import {
	PluginSettings,
	DEFAULT_SETTINGS,
	OPENAI_MODELS,
	OPENAI_MODEL_MAX_TOKENS,
	OpenAIModel,
} from "settings";
import { OpenAIClient } from "src/openai";
import { YoutubeTranscriptSummarizer } from "src/summarizer";

export default class MyPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "generate-youtube-video-summary",
			name: "Generate YouTube Video Summary",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const openAIApiKey = this.settings.openAIApiKey;

				if (openAIApiKey == undefined || openAIApiKey == "") {
					new Notice(
						"OpenAI API key is required to use this plugin."
					);
				} else {
					new YoutubeTranscriptSummarizerModal(
						this.app,
						editor,
						this.settings
					).open();
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			DEFAULT_SETTINGS,
			(await this.loadData()) ?? {}
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("OpenAI Key")
			.setDesc("Enter your OpenAI API Key to use the plugin.")
			.addText((text) =>
				text
					.setPlaceholder("Enter your API key")
					.setValue(this.plugin.settings.openAIApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openAIApiKey = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("OpenAI Model")
			.setDesc("Select the OpenAI model to use.")
			.addDropdown((dropdown) => {
				const options = OPENAI_MODELS.reduce<Record<string, string>>(
					(acc, model) => {
						acc[model] = model;
						return acc;
					},
					{}
				);

				dropdown
					.addOptions(options)
					.setValue(this.plugin.settings.openAIModel)
					.onChange(async (value) => {
						this.plugin.settings.openAIModel = value as OpenAIModel;
						this.plugin.settings.maxTokenSize =
							OPENAI_MODEL_MAX_TOKENS[value as OpenAIModel];
						await this.plugin.saveSettings();
					});
			});
	}
}

class YoutubeTranscriptSummarizerModal extends Modal {
	videoUrl: string;

	editor: Editor;
	openAIClient: OpenAIClient;
	summarizer: YoutubeTranscriptSummarizer;
	settings: PluginSettings;
	constructor(app: App, editor: Editor, settings: PluginSettings) {
		super(app);
		this.settings = settings;
		this.editor = editor;
		this.openAIClient = new OpenAIClient(this.settings);
		this.summarizer = new YoutubeTranscriptSummarizer(this.openAIClient);
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h3", { text: "Enter YouTube Video URL:" });

		new Setting(contentEl).setName("YouTube Video URL").addText((text) => {
			text.onChange((value) => {
				this.videoUrl = value;
			});
		});

		contentEl.createEl("br");
		contentEl.createEl("br");

		new Setting(contentEl).addButton((btn) => {
			btn.setButtonText("Summarize!")
				.setCta()
				.onClick(async () => {
					new Notice("Generating summary...");
					try {
						const summary = await this.summarizer.summarize(
							this.videoUrl
						);
						this.appendToEditor(summary);
						this.close();
					} catch (error) {
						new Notice(
							"Failed to generate summary: " +
								(error as Error).message
						);
					}
				});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private appendToEditor(content: string) {
		if (this.editor != null) {
			const currentValue = this.editor.getValue();
			this.editor.setValue(currentValue + "\n" + content);
		}
	}
}
