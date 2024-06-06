import { type Packager, type Config, AWSSDKVersion } from './types';

export const PACKAGER_INSTALL_COMMAND: Record<Packager, string> = {
  npm: 'npm install',
  yarn: 'yarn install',
  pnpm: 'pnpm install',
};

export const PACKAGER_ADD_COMMAND: Record<Packager, string> = {
  npm: 'npm install',
  yarn: 'yarn add',
  pnpm: 'pnpm add',
};

export const PACKAGER_LOCK_FILE_NAMES: Record<Packager, string> = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
};

export const DEFAULT_CONFIG: Config = {
  packager: 'auto',
  level: 'info',
  awsSdkVersion: 'auto',
  clean: true,
  minify: false,
  forceExclude: [],
  forceInclude: [],
};

export type Runtime = `nodejs${number}.x`;

export const INCLUDED_AWS_SDK_VERSION_BY_RUNTIME: Record<Runtime, AWSSDKVersion> = {
  'nodejs20.x': 3,
  'nodejs18.x': 3,

  'nodejs16.x': 2,
  'nodejs14.x': 2,
  'nodejs12.x': 2,
};

export const SHOULD_USE_INCLUDED_AWS_SDK_BY_RUNTIME: Record<Runtime, boolean> = {
  'nodejs20.x': false,
  'nodejs18.x': false,

  'nodejs16.x': true,
  'nodejs14.x': true,
  'nodejs12.x': true,
};

export const DEFAULT_AWS_SDK_V2_MODULES: string[] = ['aws-sdk'];
/** list fetched by following this [process](https://stackoverflow.com/a/70178439/3296811) */
export const DEFAULT_AWS_SDK_V3_MODULES: string[] = [
  '@aws-sdk/abort-controller',
  '@aws-sdk/body-checksum-node',
  '@aws-sdk/chunked-stream-reader-node',
  '@aws-sdk/client-accessanalyzer',
  '@aws-sdk/client-account',
  '@aws-sdk/client-acm-pca',
  '@aws-sdk/client-acm',
  '@aws-sdk/client-alexa-for-business',
  '@aws-sdk/client-amp',
  '@aws-sdk/client-amplify',
  '@aws-sdk/client-amplifybackend',
  '@aws-sdk/client-amplifyuibuilder',
  '@aws-sdk/client-api-gateway',
  '@aws-sdk/client-apigatewaymanagementapi',
  '@aws-sdk/client-apigatewayv2',
  '@aws-sdk/client-app-mesh',
  '@aws-sdk/client-appconfig',
  '@aws-sdk/client-appconfigdata',
  '@aws-sdk/client-appfabric',
  '@aws-sdk/client-appflow',
  '@aws-sdk/client-appintegrations',
  '@aws-sdk/client-application-auto-scaling',
  '@aws-sdk/client-application-discovery-service',
  '@aws-sdk/client-application-insights',
  '@aws-sdk/client-applicationcostprofiler',
  '@aws-sdk/client-apprunner',
  '@aws-sdk/client-appstream',
  '@aws-sdk/client-appsync',
  '@aws-sdk/client-arc-zonal-shift',
  '@aws-sdk/client-artifact',
  '@aws-sdk/client-athena',
  '@aws-sdk/client-auditmanager',
  '@aws-sdk/client-auto-scaling-plans',
  '@aws-sdk/client-auto-scaling',
  '@aws-sdk/client-b2bi',
  '@aws-sdk/client-backup-gateway',
  '@aws-sdk/client-backup',
  '@aws-sdk/client-backupstorage',
  '@aws-sdk/client-batch',
  '@aws-sdk/client-bcm-data-exports',
  '@aws-sdk/client-bedrock-agent-runtime',
  '@aws-sdk/client-bedrock-agent',
  '@aws-sdk/client-bedrock-runtime',
  '@aws-sdk/client-bedrock',
  '@aws-sdk/client-billingconductor',
  '@aws-sdk/client-braket',
  '@aws-sdk/client-budgets',
  '@aws-sdk/client-chatbot',
  '@aws-sdk/client-chime-sdk-identity',
  '@aws-sdk/client-chime-sdk-media-pipelines',
  '@aws-sdk/client-chime-sdk-meetings',
  '@aws-sdk/client-chime-sdk-messaging',
  '@aws-sdk/client-chime-sdk-voice',
  '@aws-sdk/client-chime',
  '@aws-sdk/client-cleanrooms',
  '@aws-sdk/client-cleanroomsml',
  '@aws-sdk/client-cloud9',
  '@aws-sdk/client-cloudcontrol',
  '@aws-sdk/client-clouddirectory',
  '@aws-sdk/client-cloudformation',
  '@aws-sdk/client-cloudfront-keyvaluestore',
  '@aws-sdk/client-cloudfront',
  '@aws-sdk/client-cloudhsm-v2',
  '@aws-sdk/client-cloudhsm',
  '@aws-sdk/client-cloudsearch-domain',
  '@aws-sdk/client-cloudsearch',
  '@aws-sdk/client-cloudtrail-data',
  '@aws-sdk/client-cloudtrail',
  '@aws-sdk/client-cloudwatch-events',
  '@aws-sdk/client-cloudwatch-logs',
  '@aws-sdk/client-cloudwatch',
  '@aws-sdk/client-codeartifact',
  '@aws-sdk/client-codebuild',
  '@aws-sdk/client-codecatalyst',
  '@aws-sdk/client-codecommit',
  '@aws-sdk/client-codeconnections',
  '@aws-sdk/client-codedeploy',
  '@aws-sdk/client-codeguru-reviewer',
  '@aws-sdk/client-codeguru-security',
  '@aws-sdk/client-codeguruprofiler',
  '@aws-sdk/client-codepipeline',
  '@aws-sdk/client-codestar-connections',
  '@aws-sdk/client-codestar-notifications',
  '@aws-sdk/client-codestar',
  '@aws-sdk/client-cognito-identity-provider',
  '@aws-sdk/client-cognito-identity',
  '@aws-sdk/client-cognito-sync',
  '@aws-sdk/client-comprehend',
  '@aws-sdk/client-comprehendmedical',
  '@aws-sdk/client-compute-optimizer',
  '@aws-sdk/client-config-service',
  '@aws-sdk/client-connect-contact-lens',
  '@aws-sdk/client-connect',
  '@aws-sdk/client-connectcampaigns',
  '@aws-sdk/client-connectcases',
  '@aws-sdk/client-connectparticipant',
  '@aws-sdk/client-controlcatalog',
  '@aws-sdk/client-controltower',
  '@aws-sdk/client-cost-and-usage-report-service',
  '@aws-sdk/client-cost-explorer',
  '@aws-sdk/client-cost-optimization-hub',
  '@aws-sdk/client-customer-profiles',
  '@aws-sdk/client-data-pipeline',
  '@aws-sdk/client-database-migration-service',
  '@aws-sdk/client-databrew',
  '@aws-sdk/client-dataexchange',
  '@aws-sdk/client-datasync',
  '@aws-sdk/client-datazone',
  '@aws-sdk/client-dax',
  '@aws-sdk/client-deadline',
  '@aws-sdk/client-detective',
  '@aws-sdk/client-device-farm',
  '@aws-sdk/client-devops-guru',
  '@aws-sdk/client-direct-connect',
  '@aws-sdk/client-directory-service',
  '@aws-sdk/client-dlm',
  '@aws-sdk/client-docdb-elastic',
  '@aws-sdk/client-docdb',
  '@aws-sdk/client-drs',
  '@aws-sdk/client-dynamodb-streams',
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/client-ebs',
  '@aws-sdk/client-ec2-instance-connect',
  '@aws-sdk/client-ec2',
  '@aws-sdk/client-ecr-public',
  '@aws-sdk/client-ecr',
  '@aws-sdk/client-ecs',
  '@aws-sdk/client-efs',
  '@aws-sdk/client-eks-auth',
  '@aws-sdk/client-eks',
  '@aws-sdk/client-elastic-beanstalk',
  '@aws-sdk/client-elastic-inference',
  '@aws-sdk/client-elastic-load-balancing-v2',
  '@aws-sdk/client-elastic-load-balancing',
  '@aws-sdk/client-elastic-transcoder',
  '@aws-sdk/client-elasticache',
  '@aws-sdk/client-elasticsearch-service',
  '@aws-sdk/client-emr-containers',
  '@aws-sdk/client-emr-serverless',
  '@aws-sdk/client-emr',
  '@aws-sdk/client-entityresolution',
  '@aws-sdk/client-eventbridge',
  '@aws-sdk/client-evidently',
  '@aws-sdk/client-finspace-data',
  '@aws-sdk/client-finspace',
  '@aws-sdk/client-firehose',
  '@aws-sdk/client-fis',
  '@aws-sdk/client-fms',
  '@aws-sdk/client-forecast',
  '@aws-sdk/client-forecastquery',
  '@aws-sdk/client-frauddetector',
  '@aws-sdk/client-freetier',
  '@aws-sdk/client-fsx',
  '@aws-sdk/client-gamelift',
  '@aws-sdk/client-glacier',
  '@aws-sdk/client-global-accelerator',
  '@aws-sdk/client-glue',
  '@aws-sdk/client-grafana',
  '@aws-sdk/client-greengrass',
  '@aws-sdk/client-greengrassv2',
  '@aws-sdk/client-groundstation',
  '@aws-sdk/client-guardduty',
  '@aws-sdk/client-health',
  '@aws-sdk/client-healthlake',
  '@aws-sdk/client-honeycode',
  '@aws-sdk/client-iam',
  '@aws-sdk/client-identitystore',
  '@aws-sdk/client-imagebuilder',
  '@aws-sdk/client-inspector-scan',
  '@aws-sdk/client-inspector',
  '@aws-sdk/client-inspector2',
  '@aws-sdk/client-internetmonitor',
  '@aws-sdk/client-iot-1click-devices-service',
  '@aws-sdk/client-iot-1click-projects',
  '@aws-sdk/client-iot-data-plane',
  '@aws-sdk/client-iot-events-data',
  '@aws-sdk/client-iot-events',
  '@aws-sdk/client-iot-jobs-data-plane',
  '@aws-sdk/client-iot-wireless',
  '@aws-sdk/client-iot',
  '@aws-sdk/client-iotanalytics',
  '@aws-sdk/client-iotdeviceadvisor',
  '@aws-sdk/client-iotfleethub',
  '@aws-sdk/client-iotfleetwise',
  '@aws-sdk/client-iotsecuretunneling',
  '@aws-sdk/client-iotsitewise',
  '@aws-sdk/client-iotthingsgraph',
  '@aws-sdk/client-iottwinmaker',
  '@aws-sdk/client-ivs-realtime',
  '@aws-sdk/client-ivs',
  '@aws-sdk/client-ivschat',
  '@aws-sdk/client-kafka',
  '@aws-sdk/client-kafkaconnect',
  '@aws-sdk/client-kendra-ranking',
  '@aws-sdk/client-kendra',
  '@aws-sdk/client-keyspaces',
  '@aws-sdk/client-kinesis-analytics-v2',
  '@aws-sdk/client-kinesis-analytics',
  '@aws-sdk/client-kinesis-video-archived-media',
  '@aws-sdk/client-kinesis-video-media',
  '@aws-sdk/client-kinesis-video-signaling',
  '@aws-sdk/client-kinesis-video-webrtc-storage',
  '@aws-sdk/client-kinesis-video',
  '@aws-sdk/client-kinesis',
  '@aws-sdk/client-kms',
  '@aws-sdk/client-lakeformation',
  '@aws-sdk/client-lambda',
  '@aws-sdk/client-launch-wizard',
  '@aws-sdk/client-lex-model-building-service',
  '@aws-sdk/client-lex-models-v2',
  '@aws-sdk/client-lex-runtime-service',
  '@aws-sdk/client-lex-runtime-v2',
  '@aws-sdk/client-license-manager-linux-subscriptions',
  '@aws-sdk/client-license-manager-user-subscriptions',
  '@aws-sdk/client-license-manager',
  '@aws-sdk/client-lightsail',
  '@aws-sdk/client-location',
  '@aws-sdk/client-lookoutequipment',
  '@aws-sdk/client-lookoutmetrics',
  '@aws-sdk/client-lookoutvision',
  '@aws-sdk/client-m2',
  '@aws-sdk/client-machine-learning',
  '@aws-sdk/client-macie2',
  '@aws-sdk/client-managedblockchain-query',
  '@aws-sdk/client-managedblockchain',
  '@aws-sdk/client-marketplace-agreement',
  '@aws-sdk/client-marketplace-catalog',
  '@aws-sdk/client-marketplace-commerce-analytics',
  '@aws-sdk/client-marketplace-deployment',
  '@aws-sdk/client-marketplace-entitlement-service',
  '@aws-sdk/client-marketplace-metering',
  '@aws-sdk/client-mediaconnect',
  '@aws-sdk/client-mediaconvert',
  '@aws-sdk/client-medialive',
  '@aws-sdk/client-mediapackage-vod',
  '@aws-sdk/client-mediapackage',
  '@aws-sdk/client-mediapackagev2',
  '@aws-sdk/client-mediastore-data',
  '@aws-sdk/client-mediastore',
  '@aws-sdk/client-mediatailor',
  '@aws-sdk/client-medical-imaging',
  '@aws-sdk/client-memorydb',
  '@aws-sdk/client-mgn',
  '@aws-sdk/client-migration-hub-refactor-spaces',
  '@aws-sdk/client-migration-hub',
  '@aws-sdk/client-migrationhub-config',
  '@aws-sdk/client-migrationhuborchestrator',
  '@aws-sdk/client-migrationhubstrategy',
  '@aws-sdk/client-mobile',
  '@aws-sdk/client-mq',
  '@aws-sdk/client-mturk',
  '@aws-sdk/client-mwaa',
  '@aws-sdk/client-neptune-graph',
  '@aws-sdk/client-neptune',
  '@aws-sdk/client-neptunedata',
  '@aws-sdk/client-network-firewall',
  '@aws-sdk/client-networkmanager',
  '@aws-sdk/client-networkmonitor',
  '@aws-sdk/client-nimble',
  '@aws-sdk/client-oam',
  '@aws-sdk/client-omics',
  '@aws-sdk/client-opensearch',
  '@aws-sdk/client-opensearchserverless',
  '@aws-sdk/client-opsworks',
  '@aws-sdk/client-opsworkscm',
  '@aws-sdk/client-organizations',
  '@aws-sdk/client-osis',
  '@aws-sdk/client-outposts',
  '@aws-sdk/client-panorama',
  '@aws-sdk/client-payment-cryptography-data',
  '@aws-sdk/client-payment-cryptography',
  '@aws-sdk/client-pca-connector-ad',
  '@aws-sdk/client-personalize-events',
  '@aws-sdk/client-personalize-runtime',
  '@aws-sdk/client-personalize',
  '@aws-sdk/client-pi',
  '@aws-sdk/client-pinpoint-email',
  '@aws-sdk/client-pinpoint-sms-voice-v2',
  '@aws-sdk/client-pinpoint-sms-voice',
  '@aws-sdk/client-pinpoint',
  '@aws-sdk/client-pipes',
  '@aws-sdk/client-polly',
  '@aws-sdk/client-pricing',
  '@aws-sdk/client-privatenetworks',
  '@aws-sdk/client-proton',
  '@aws-sdk/client-qbusiness',
  '@aws-sdk/client-qconnect',
  '@aws-sdk/client-qldb-session',
  '@aws-sdk/client-qldb',
  '@aws-sdk/client-quicksight',
  '@aws-sdk/client-ram',
  '@aws-sdk/client-rbin',
  '@aws-sdk/client-rds-data',
  '@aws-sdk/client-rds',
  '@aws-sdk/client-redshift-data',
  '@aws-sdk/client-redshift-serverless',
  '@aws-sdk/client-redshift',
  '@aws-sdk/client-rekognition',
  '@aws-sdk/client-rekognitionstreaming',
  '@aws-sdk/client-repostspace',
  '@aws-sdk/client-resiliencehub',
  '@aws-sdk/client-resource-explorer-2',
  '@aws-sdk/client-resource-groups-tagging-api',
  '@aws-sdk/client-resource-groups',
  '@aws-sdk/client-robomaker',
  '@aws-sdk/client-rolesanywhere',
  '@aws-sdk/client-route-53-domains',
  '@aws-sdk/client-route-53',
  '@aws-sdk/client-route53-recovery-cluster',
  '@aws-sdk/client-route53-recovery-control-config',
  '@aws-sdk/client-route53-recovery-readiness',
  '@aws-sdk/client-route53resolver',
  '@aws-sdk/client-rum',
  '@aws-sdk/client-s3-control',
  '@aws-sdk/client-s3',
  '@aws-sdk/client-s3outposts',
  '@aws-sdk/client-sagemaker-a2i-runtime',
  '@aws-sdk/client-sagemaker-edge',
  '@aws-sdk/client-sagemaker-featurestore-runtime',
  '@aws-sdk/client-sagemaker-geospatial',
  '@aws-sdk/client-sagemaker-metrics',
  '@aws-sdk/client-sagemaker-runtime',
  '@aws-sdk/client-sagemaker',
  '@aws-sdk/client-savingsplans',
  '@aws-sdk/client-scheduler',
  '@aws-sdk/client-schemas',
  '@aws-sdk/client-secrets-manager',
  '@aws-sdk/client-securityhub',
  '@aws-sdk/client-securitylake',
  '@aws-sdk/client-serverlessapplicationrepository',
  '@aws-sdk/client-service-catalog-appregistry',
  '@aws-sdk/client-service-catalog',
  '@aws-sdk/client-service-quotas',
  '@aws-sdk/client-servicediscovery',
  '@aws-sdk/client-ses',
  '@aws-sdk/client-sesv2',
  '@aws-sdk/client-sfn',
  '@aws-sdk/client-shield',
  '@aws-sdk/client-signer',
  '@aws-sdk/client-simspaceweaver',
  '@aws-sdk/client-sms',
  '@aws-sdk/client-snow-device-management',
  '@aws-sdk/client-snowball',
  '@aws-sdk/client-sns',
  '@aws-sdk/client-sqs',
  '@aws-sdk/client-ssm-contacts',
  '@aws-sdk/client-ssm-incidents',
  '@aws-sdk/client-ssm-sap',
  '@aws-sdk/client-ssm',
  '@aws-sdk/client-sso-admin',
  '@aws-sdk/client-sso-oidc',
  '@aws-sdk/client-sso',
  '@aws-sdk/client-storage-gateway',
  '@aws-sdk/client-sts',
  '@aws-sdk/client-supplychain',
  '@aws-sdk/client-support-app',
  '@aws-sdk/client-support',
  '@aws-sdk/client-swf',
  '@aws-sdk/client-synthetics',
  '@aws-sdk/client-textract',
  '@aws-sdk/client-timestream-influxdb',
  '@aws-sdk/client-timestream-query',
  '@aws-sdk/client-timestream-write',
  '@aws-sdk/client-tnb',
  '@aws-sdk/client-transcribe-streaming',
  '@aws-sdk/client-transcribe',
  '@aws-sdk/client-transfer',
  '@aws-sdk/client-translate',
  '@aws-sdk/client-trustedadvisor',
  '@aws-sdk/client-verifiedpermissions',
  '@aws-sdk/client-voice-id',
  '@aws-sdk/client-vpc-lattice',
  '@aws-sdk/client-waf-regional',
  '@aws-sdk/client-waf',
  '@aws-sdk/client-wafv2',
  '@aws-sdk/client-wellarchitected',
  '@aws-sdk/client-wisdom',
  '@aws-sdk/client-workdocs',
  '@aws-sdk/client-worklink',
  '@aws-sdk/client-workmail',
  '@aws-sdk/client-workmailmessageflow',
  '@aws-sdk/client-workspaces-thin-client',
  '@aws-sdk/client-workspaces-web',
  '@aws-sdk/client-workspaces',
  '@aws-sdk/client-xray',
  '@aws-sdk/cloudfront-signer',
  '@aws-sdk/config-resolver',
  '@aws-sdk/core',
  '@aws-sdk/credential-provider-cognito-identity',
  '@aws-sdk/credential-provider-env',
  '@aws-sdk/credential-provider-http',
  '@aws-sdk/credential-provider-imds',
  '@aws-sdk/credential-provider-ini',
  '@aws-sdk/credential-provider-node',
  '@aws-sdk/credential-provider-process',
  '@aws-sdk/credential-provider-sso',
  '@aws-sdk/credential-provider-web-identity',
  '@aws-sdk/credential-providers',
  '@aws-sdk/ec2-metadata-service',
  '@aws-sdk/endpoint-cache',
  '@aws-sdk/eventstream-codec',
  '@aws-sdk/eventstream-handler-node',
  '@aws-sdk/eventstream-serde-browser',
  '@aws-sdk/eventstream-serde-config-resolver',
  '@aws-sdk/eventstream-serde-node',
  '@aws-sdk/eventstream-serde-universal',
  '@aws-sdk/fetch-http-handler',
  '@aws-sdk/hash-node',
  '@aws-sdk/hash-stream-node',
  '@aws-sdk/invalid-dependency',
  '@aws-sdk/is-array-buffer',
  '@aws-sdk/lib-dynamodb',
  '@aws-sdk/lib-storage',
  '@aws-sdk/md5-js',
  '@aws-sdk/middleware-api-key',
  '@aws-sdk/middleware-apply-body-checksum',
  '@aws-sdk/middleware-bucket-endpoint',
  '@aws-sdk/middleware-content-length',
  '@aws-sdk/middleware-endpoint-discovery',
  '@aws-sdk/middleware-endpoint',
  '@aws-sdk/middleware-eventstream',
  '@aws-sdk/middleware-expect-continue',
  '@aws-sdk/middleware-flexible-checksums',
  '@aws-sdk/middleware-host-header',
  '@aws-sdk/middleware-location-constraint',
  '@aws-sdk/middleware-logger',
  '@aws-sdk/middleware-recursion-detection',
  '@aws-sdk/middleware-retry',
  '@aws-sdk/middleware-sdk-api-gateway',
  '@aws-sdk/middleware-sdk-ec2',
  '@aws-sdk/middleware-sdk-eventbridge',
  '@aws-sdk/middleware-sdk-glacier',
  '@aws-sdk/middleware-sdk-machinelearning',
  '@aws-sdk/middleware-sdk-rds',
  '@aws-sdk/middleware-sdk-route53',
  '@aws-sdk/middleware-sdk-s3-control',
  '@aws-sdk/middleware-sdk-s3',
  '@aws-sdk/middleware-sdk-sqs',
  '@aws-sdk/middleware-sdk-sts',
  '@aws-sdk/middleware-sdk-transcribe-streaming',
  '@aws-sdk/middleware-serde',
  '@aws-sdk/middleware-signing',
  '@aws-sdk/middleware-ssec',
  '@aws-sdk/middleware-stack',
  '@aws-sdk/middleware-token',
  '@aws-sdk/middleware-user-agent',
  '@aws-sdk/middleware-websocket',
  '@aws-sdk/node_modules@ extraneous',
  '@aws-sdk/node-config-provider',
  '@aws-sdk/node-http-handler',
  '@aws-sdk/polly-request-presigner',
  '@aws-sdk/property-provider',
  '@aws-sdk/protocol-http',
  '@aws-sdk/querystring-builder',
  '@aws-sdk/querystring-parser',
  '@aws-sdk/rds-signer',
  '@aws-sdk/region-config-resolver',
  '@aws-sdk/s3-presigned-post',
  '@aws-sdk/s3-request-presigner',
  '@aws-sdk/service-error-classification',
  '@aws-sdk/sha256-tree-hash',
  '@aws-sdk/shared-ini-file-loader',
  '@aws-sdk/signature-v4-crt',
  '@aws-sdk/signature-v4-multi-region',
  '@aws-sdk/signature-v4',
  '@aws-sdk/smithy-client',
  '@aws-sdk/token-providers',
  '@aws-sdk/types',
  '@aws-sdk/url-parser',
  '@aws-sdk/util-arn-parser',
  '@aws-sdk/util-base64-node',
  '@aws-sdk/util-base64',
  '@aws-sdk/util-body-length-node',
  '@aws-sdk/util-buffer-from',
  '@aws-sdk/util-config-provider',
  '@aws-sdk/util-create-request',
  '@aws-sdk/util-defaults-mode-node',
  '@aws-sdk/util-dns',
  '@aws-sdk/util-dynamodb',
  '@aws-sdk/util-endpoints',
  '@aws-sdk/util-format-url',
  '@aws-sdk/util-hex-encoding',
  '@aws-sdk/util-locate-window',
  '@aws-sdk/util-middleware',
  '@aws-sdk/util-retry',
  '@aws-sdk/util-stream-node',
  '@aws-sdk/util-stream',
  '@aws-sdk/util-uri-escape',
  '@aws-sdk/util-user-agent-node',
  '@aws-sdk/util-utf8-browser',
  '@aws-sdk/util-utf8-node',
  '@aws-sdk/util-utf8',
  '@aws-sdk/util-waiter',
  '@aws-sdk/xhr-http-handler',
  '@aws-sdk/xml-builder',
];
