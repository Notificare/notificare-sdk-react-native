# Release process

1. Update the version of each library.
```shell
bundle exec fastlane bump version:foo
```
2. Update the sample app.
```shell
bundle exec fastlane update_sample
```
3. Ensure there are no publishing issues.
```shell
bundle exec fastlane publish dry_run:true
```
4. Update the `CHANGELOG.md`.
5. Push the generated changes to the repository.
6. Release the libraries.
```shell
bundle exec fastlane publish
```
7. Create a GitHub release with the contents of the `CHANGELOG.md`.
