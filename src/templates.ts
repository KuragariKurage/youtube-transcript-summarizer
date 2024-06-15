export const SUMMARIZE_PROMPT_TEMPLATE = `You are the most professional writer in the world.

Write a concise summary of the following in Japanese.
The summary must be structured.
:

{context}

要約結果：
`;

export const SUMMARY_MARKDOWN_TEMPLATE = `
---
title: {title}
author: {author}
date: {publish_date}
---

![thumbnail]({thumbnail_url})

<iframe title="{title}" src="https://www.youtube.com/embed/{source}?feature=oembed" height="150" width="200" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

{summary}
`;
