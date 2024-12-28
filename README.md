# ScribbleCareBear

Scribble Care Bear is a sophisticated Discord bot crafted to empower the ScribbleLab community. Packed with intelligent features, it serves as a comprehensive assistant to keep your server organized, engaging, and connected with the ScribbleAPI. Whether it’s welcoming new members, automating moderation, managing reaction roles, or conducting advanced polls, Scribble Care Bear ensures a seamless community experience.

### Overview

Scribble Care Bear brings together the essential and the innovative:

- **Seamless Welcoming:** Automatically greet and onboard new members.
- **Smart Auto-Moderation:** Detect and handle spam and offensive content.
- **Effortless Role Management:** Set up roles that members can assign themselves through emoji reactions.
- **Effective Support Tickets:** Create and manage tickets for member queries or reports.
- **Advanced Polls & Analytics:** Collect opinions and analyze results easily.
- **API Monitoring:** Keep an eye on ScribbleAPI’s performance and status.

> [!IMPORTANT]
> You are not allowed to replicate ScribbleCareBear for yourself unless it is used for testing purposes for contributions to this repository. Learn more about this on our [Terms of Service]().

## Getting Started

Setting up Scribble Care Bear on your Discord server is simple yet involves a few critical steps to ensure everything works smoothly. Follow this guide carefully.

### Step 1: Prerequisites

Before you begin, ensure you have the following:

1. **Node.js (v20.11.1 or later):** Download and install the latest version from [nodejs.org](https://nodejs.org). Ensure that both `node` and `npm` are correctly installed and accessible via the command line.

2. **Discord Bot Token**

   - Visit the [Discord Developer Portal](https://discord.com/developers/)
   - Go to the **Applications** tab, click **New Application**, and name your bot
   - Under the Bot section, create a bot and copy its token. Keep this token secure! Sharing it publicly can compromise your bot.

3. **Text Editor/IDE:** Use a reliable text editor like [Visual Studio Code](https://code.visualstudio.com) for editing ScribbleCareBear's code and configuration files.

> [!IMPORTANT]
> Make sure you understand how to manage secrets securely in your environment to avoid exposing sensitive information.

### Step 2: Cloning the Repository

First, clone the Scribble Care Bear repository from GitHub:

```sh
git clone https://github.com/ScribbleLabApp/ScribbleCareBear.git
cd ScribbleCareBear
```

> [!TIP]
> If you’re unfamiliar with Git, you can also download the repository as a ZIP file and extract it to a directory of your choice.

### Step 3: Installing Dependencies

Navigate into your project directory and install the required packages using npm:

```sh
npm install
```

This command will download and install all dependencies listed in `package.json`, such as `discord.js`.

> **Note:** Ensure your internet connection is stable to prevent incomplete installations. If you face issues, try using `npm cache clean --force` and then reinstalling.

### Step 4: ScribbleCareBear Configuration

1. **Rename the Configuration File:** Rename `config.example.json` to `config.json`. This file holds crucial details about your bot and server configuration.

2. **Update Configuration Details:** Open `config.json` in your text editor and fill in the required fields:

   ```json
   {
     "APPLICATION_ID": "<APPLICATION_ID>",
     "TOKEN": "<TOKEN_ID>",
     "GUILD_ID": "<GUILD_ID>",
     "version": "0.0.1-development",
     "build": "0b000001",
     "developer": "ScribbleLabApp"
   }
   ```

   #### Arguments

   ##### APPLICATION_ID

   You can find this in your Discord Developer Portal under your bot’s application settings.

> [!CAUTION] > **Security Reminder:** Keep `config.json` safe and avoid pushing it to public repositories. Use environment variables or secret management tools if needed. Alternatively you can ignore this file using `.gitignore`.

### Step 5: Running the bot

Now, it’s time to bring Scribble Care Bear to life:

```sh
node .
```

- **Success Message:** You should see a message indicating that the bot is online and ready.

- **Troubleshooting:** If the bot doesn’t start, double-check your configuration and ensure your token is correct. Look for error messages in the terminal to diagnose issues.

> **Pro Tip:** You can use nodemon to automatically restart your bot when you make changes to the code. Install it globally using `npm install -g nodemon` and run your bot with `nodemon .`.

### Step 6: Inviting the ScribbleCareBear to testing Server

1. Visit the OAuth2 tab in the [Discord Developer Portal](https://discord.com/developers/).
2. Select the following scopes:
   - `bot`
   - `applications.commands`
3. Give ScribbleCareBear administrative permissions (needed for role management, etc.)
4. Generate and copy the invite link, then paste it into your browser to invite your ScribbleCareBear testing instance to your testing server.
