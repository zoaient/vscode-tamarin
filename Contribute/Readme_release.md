## Documentation on how to release the extension 

The plugin is available on two different websites :
 - https://marketplace.visualstudio.com/items?itemName=tamarin-prover.tamarin-prover

 - https://open-vsx.org/extension/tamarin-prover/tamarin-prover


 For each website you will need an access token in order to publish the extension. This you can create using you azure dev ops account as described here :
 \
  https://code.visualstudio.com/api/working-with-extensions/publishing-extension
 \
 or your Eclipse account as described here : https://github.com/eclipse/openvsx/wiki/Publishing-Extensions
\
For vscode the access token is required before publishing using ```vsce login private_access_token```.

In order to push a new version or release you will need to use the following commands : 
```vsce publish version_n°``` for vscode and ```npx ovsx publish -p private_access_token``` for openVSX

Make sure to remove all the errors otherwise it won't publish. The error messages are quite clear to help you debug. For vscode you can specify in the ```package.json``` file the files you want to include in the extension. Make sure everything necessary to run your code is present. 



