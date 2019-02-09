const dev = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "innovation-unboxed-api-dev-auditdatabucket-2vfgpu8v8g4b"
    },
    apiGateway: {
        REGION: "eu-west-1",
        URL: "https://mci3dcagi4.execute-api.eu-west-1.amazonaws.com/dev"
    },
    cognito: {
        REGION: "eu-west-1",
        USER_POOL_ID: "eu-west-1_tUWdR4vMb",
        APP_CLIENT_ID: "3rc4rvus0sg7pc5ffcifnpp8o3",
        IDENTITY_POOL_ID: "eu-west-1:ce4df954-b775-41dc-9f24-42268b80f22d"
    }
};

const prod = {
    s3: {
        REGION: "YOUR_PROD_S3_UPLOADS_BUCKET_REGION",
        BUCKET: "YOUR_PROD_S3_UPLOADS_BUCKET_NAME"
    },
    apiGateway: {
        REGION: "YOUR_PROD_API_GATEWAY_REGION",
        URL: "YOUR_PROD_API_GATEWAY_URL"
    },
    cognito: {
        REGION: "YOUR_PROD_COGNITO_REGION",
        USER_POOL_ID: "YOUR_PROD_COGNITO_USER_POOL_ID",
        APP_CLIENT_ID: "YOUR_PROD_COGNITO_APP_CLIENT_ID",
        IDENTITY_POOL_ID: "YOUR_PROD_IDENTITY_POOL_ID"
    }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // Add common config values here
    ...config
};


