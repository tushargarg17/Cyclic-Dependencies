# Cyclic Dependencies

**[Why my React app felt slow even though nothing was broken](https://medium.com/@tshrgarg2010/why-my-react-app-felt-slow-even-though-nothing-was-broken-2f1b6c65b975)** (Medium)

This repo provides **GitHub Actions** and **ESLint rules** to detect and prevent cyclic (circular) dependencies in JavaScript, TypeScript, and React projects.

## Why cyclic dependencies are a problem

A **cyclic dependency** exists when module A imports B, B imports C, and C (directly or indirectly) imports A again. That can lead to:

- **`undefined` at runtime** – modules may run before their dependencies are fully initialized.
- **Hard-to-debug bugs** – behavior depends on load order and can change when refactoring.
- **Tight coupling** – cycles make it difficult to reason about and test code.

Breaking cycles improves maintainability and prevents subtle runtime issues.

---

## 1. GitHub Action: detect cyclic dependencies

A workflow runs [madge](https://github.com/pahen/madge) on push/PR to **main** or **master** and fails if any circular dependency is found.

### Setup

1. Copy the workflow into your repo:
   - `.github/workflows/detect-cyclic-dependencies.yml`
2. Ensure your app entry (or source directory) is correct in the workflow.

**Default entry:** the workflow runs madge on the `src` directory. If your app lives elsewhere (e.g. `app`, `lib`, or repo root), edit the workflow and change the last step:

```yaml
- name: Detect cyclic dependencies
  run: npx madge@latest --circular --extensions js,jsx,ts,tsx src
```

Replace `src` with your entry path (e.g. `app`, `.`, or `packages/web/src`).

### What happens when cycles are found

Madge prints the cycles to the job log and the workflow fails. Fix the reported cycles (see “Removing cyclic dependencies” below) and push again.

---

## 2. ESLint rules for cyclic dependencies

The file **`eslint-rules-cyclic-dependencies.js`** enables the **`import/no-cycle`** rule from [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import), so ESLint reports cycles in your IDE and in local/CI lint runs.

### Setup

1. Install the plugin (in the repo that will use the rule):

   ```bash
   npm install --save-dev eslint-plugin-import
   ```

2. Use the rules in your ESLint config.

   **If you use `.eslintrc.js` (or similar):**

   ```js
   module.exports = {
     extends: [
       // your existing config
       './path/to/eslint-rules-cyclic-dependencies.js',
     ],
   };
   ``

3. Run ESLint as usual; any cycle will be reported as an error (or warning if you change the rule severity).


## 3. Removing cyclic dependencies

1. **Detect** – Use the GitHub Action and/or ESLint (and optionally `npx madge --circular <entry>` locally).
2. **Find the cycle** – Note which files form the loop (e.g. A → B → C → A).
3. **Break the cycle** by:
   - **Extracting shared code** – Move code that both sides need into a third module (e.g. types, utils, constants) and import from there.
   - **Inverting dependency** – Prefer depending on the “lower-level” module (e.g. utils) from the “higher-level” one (e.g. feature), not the other way around.
   - **Dependency injection / callbacks** – Pass behavior in as arguments instead of importing the caller.
   - **Dynamic `import()`** – Load a module only when needed so it’s not in the static cycle (use sparingly; document why).
4. **Re-run** the Action and ESLint until no cycles are reported.

---

## Files in this repo

| File | Purpose |
|------|--------|
| `.github/workflows/detect-cyclic-dependencies.yml` | CI workflow that runs madge and fails on cycles. |
| `eslint-rules-cyclic-dependencies.js` | ESLint config snippet that enables `import/no-cycle`. |
| `README.md` | This documentation. |

You can copy the workflow and the ESLint rules file into your own repo and adjust paths and options as needed.
