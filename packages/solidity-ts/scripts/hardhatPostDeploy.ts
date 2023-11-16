import { contractsDir, graphDir, hardhatPublishToOtherPackage, sdkDir, webappDir } from '~helpers/functions/hardhat/publishToSubgraph';
// run script
hardhatPublishToOtherPackage(contractsDir);
hardhatPublishToOtherPackage(graphDir);
hardhatPublishToOtherPackage(webappDir);
hardhatPublishToOtherPackage(sdkDir);
