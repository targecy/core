import { graphDir, hardhatPublishToOtherPackage, sdkDir, webappDir } from '~helpers/functions/hardhat/publishToSubgraph';
// run script
hardhatPublishToOtherPackage(graphDir);
hardhatPublishToOtherPackage(webappDir);
hardhatPublishToOtherPackage(sdkDir);
