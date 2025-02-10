# RegolithCo

I should probably Write a readme now that this is public

## General development guidelines

- Always use the `RegolithCo.code-workspace` file to open the project. This will ensure that you have the correct settings for the project.
- Always make sure your eslint is working so you don't introduce a bunch of whitespace errors.
  
## Branches

### `dev` branch gets autodeployed to staging

Always make sure your pull requests are against the `dev` branch. This is the branch that gets autodeployed to the staging environment so we can test changes before they go live.

### `main` branch gets autodeployed to production

Once dev is good to go we merge main up through it and things go live to production. 

## Bootstrapping

### Stats files

Run `./scrips/syncStats.sh` to sync the production stats if you want the most recent ones.

### `.env` file

You will need a `.env` file with the following values:

```conf
BROWSER=none
NODE_ENV=development

# Choose the API you want to run against (Production will block localhost requests so staging is your only option)
VITE_STAGE=staging
VITE_API_URL=https://api.regolith.rocks/staging
VITE_API_URL_PUB=https://api.regolith.rocks/staging/public
VITE_SHARE_URL=https://api.regolith.rocks/sharing

# Ask me for these. They're not really secret but I still feel weird committing them to git
VITE_GOOGLE_CLIENT_ID=XXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
VITE_DISCORD_CLIENT_ID=XXXXXXXXXXXXXXXXXX
```