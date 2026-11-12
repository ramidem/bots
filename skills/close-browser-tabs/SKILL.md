---
name: close-browser-tabs
description: Close every browser tab you opened once you no longer need it. Use whenever you open or use a tab in the OpenBot browser (open, list_tabs, run_script), and before ending any turn or routine run that touched the browser.
---

# Close browser tabs

Tabs stay open across turns and restarts, and only 25 fit. Leave none behind.

1. When a step is done with a tab, close it with `openbot_browser.close_tab` (tabId from `open` or `list_tabs`).
2. Before your final answer or routine report, call `list_tabs` once and close every tab you opened and do not need next.
3. Keep a tab open only when:
   - the user asked to keep it or see it,
   - a sign-in or `request_takeover` is still pending on it, or
   - a task that is still running will use it next.
   Say in one line which tab you kept and why.
4. After a sign-in that opens a popup tab, close the popup once it finishes.
5. Close only tabs you own. Never touch another bot's tabs.
6. If you find stale tabs from an earlier turn that you no longer need, close them too.
