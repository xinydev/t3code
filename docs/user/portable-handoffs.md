# Conversation context when switching providers

This build keeps the native conversation when the provider can resume or fork it.
A fresh native session receives your current request and the context and attachments
you added in the composer. T3 Code skips building history summaries for provider
changes, side chats, recovery, and forks that need a fresh session. Conversation
merge-back is disabled.

This build also skips prompts generated from background notifications, interrupted turns,
and usage-limit resets. You can send a new message or use a provider's native resume.
Use the provider's native commands to invoke skills. Snapshot attachments reach the provider
as images without the window title or accessibility data.
