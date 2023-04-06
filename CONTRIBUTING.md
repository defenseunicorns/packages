## Adding Packages

If you have a package that you'd like to add, please update the README table with the relevant information about your package in the same format that already exists. Once you've added the package, Renovate bot will daily check your package for new versions and automatically update the README entry if it finds a newer released version.

## Adding Other Sections

If you would like to update the README with sections other than packages, you can do that but be mindful of the package table. The `renovate.json` config uses the format of the packages table to find the information it needs to do lookups on package versions.

## Updating Renovate JSON

Currently the `renovate.json` config is set up with a single `regexManager` that looks at the packages table in the `README.md` file and finds each package's registryUrl, depName, and versioning (currentValue).

### Controlling Default Dependency Checks

Renovate has default behavior for checking files like package.json, Dockerfile, and githhub actions among others. If you want to control what dependency files outside of the packages table are found (or not found) you can update the `ignorePaths` array.

### PRs

If you'd like for each dependency update to have separate PRs you can remove the `groupName: 'all'` field.

### Updating Regex Manager

Changing the package table might necessitate an update to the docker regexManager. If you change things, be aware that the `depName` does need to match the casing of the path on the registry and actually needs to be the entire path to the package on ghcr not just the package name.

The way Renovate constructs it's API calls is it takes the registry url (`https://ghcr.io` in our case) and appends `/v2/` and then adds the `depName`. If you leave the path to the package as part of the registry url capture group (`(?<registryUrl.+)`), Renovate will append `/v2/` to the end of the path instead of before it.

| Good                                                        | Bad                                                         |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `https://ghcr.io/v2/path/to/package/package-name/tags/list` | `https://ghcr.io/path/to/package/v2/package-name/tags/list` |

### Triggering A Run

_Every time the renovate config is updated and pushed, Renovate bot will trigger. If you're not seeing a successful outcome from your changes and do not have access to the Defense Unicorns renovate dashboard to check logs, please contact Tommy._
