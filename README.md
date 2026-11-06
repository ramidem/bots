# bots

Generic records of an OpenBot agent fleet. No personal data.

## Leak check

`scripts/leak-check.mjs` scans the repo's text files for terms from a private list and for common secret and personal-data shapes. It prints only the path, line number and rule id of each match (never the matched text or the list), and exits 1 if anything matches (0 if clean, 2 on a usage or IO error).

```
node scripts/leak-check.mjs <blocklist-file> [dir]
```

The list is one case-insensitive regular expression per line (blank lines and `#` comments are allowed; rule ids are line numbers). It stays outside the repo, and the script refuses a list that lives inside the scanned directory. Run it from the repo root before publishing.
