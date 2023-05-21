# :gift: FilePond Plugin Tarball

This is an extension plugin for [FilePond](https://pqina.nl/filepond/) uploader where you can upload directories as Tar Files instead of uploading each individual files in them separately.

## :package: Installation

Currently unavailable.

### CDN

Currently unavailable.

## :fire: Usage

This may differ depending upon the Framework you are using, but there is good documentation of how to register plugins in various Frameworks in FilePond website which you can follow.

```js
import FilePondPluginTarball from 'filepond-plugin-tarball';

FilePond.registerPlugin(FilePondPluginTarball());

// Make sure you register it as a function
// cause you can pass in hook to tap into the tar files.
```

### :star: Hook Support

In many cases, specially while using some reactive frameworks you might like to show some loading screen while it is archiving files which might take some time depending upon the directory size.

In those cases you can pass a callback function inside the `FilePondTarball()`. If you pass a callback then it won't add the tar files in the queue directly. Instead, it will give you the Array of Promise objects which you can tap into to show loading and inject the tar files when they are done.

**Example:**
```js
const pond = FilePond.create(...);

const injector = async (generators) => {
  // Set Loading...
  const files = await Promise.all(
    generators.map(generate => generate())
  );
  pond.addFiles(files);
  // Stop loading...

  // OR. If you want to tap individually

  // Set Loading...
  generators.forEach(generate => {
    const file = await generate();
    pond.addFile(file);
  });
  // Stop Loading...
};

FilePond.registerPlugin(FilePondPluginTarball(injector));
```

## :microscope: Testing

After Cloning the repository, install all npm dependencies by running: `npm install`.

Then Run Tests:

```bash
$ npm run test
```

## :date: Change log

This repository follows semantic versioning. Please follow the releases to know about what changed.

## :heart: Contributing

Please feel free to contribute ideas and PRs are most welcome.

## :crown: Credits

- [mtaku3][link-author]
- [All Contributors][link-contributors]

## :policeman: License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://mtaku3.com
[link-contributors]: ../../contributors
