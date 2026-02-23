<div align="center">

<h1> Creating apps & tools of the future</h1>

</br>

![Blackgate Pen](<https://raw.githubusercontent.com/Blackgate-Pen-Holdings/.github/refs/heads/main/profile/resources/Blackgate%20Black.png>)

</br>

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&pause=1500&color=5D009A&center=true&vCenter=true&random=true&width=700&height=100&lines=Smart+Solutions+for+a+More+Efficient+Tomorrow.;Transforming+Potential+into+Performance+with+AI)


## 🚀 Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Blackgate-Pen-Holdings/viber-production)

**👆 Click to deploy your own instance!**

*Follow the setup guide below to configure required services*

</div>

---

## 📋 Quick Deploy Checklist

Before clicking "Deploy to Cloudflare", have these ready:

### ✅ Prerequisites
- Cloudflare Workers Paid Plan
- Workers for Platforms subscription
- Advanced Certificate Manager (needed when you map a first-level subdomain such as `abc.xyz.com` so Cloudflare can issue the required wildcard certificate for preview apps on `*.abc.xyz.com`)

### 🔑 Required API Key
- **Google Gemini API Key** - Get from [ai.google.dev](https://ai.google.dev)

Once you click "Deploy to Cloudflare", you'll be taken to your Cloudflare dashboard where you can configure your VibeSDK deployment with these variables. 

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Blackgate-Pen-Holdings/viber-production)

### 🔑 What you'll configure

- `GOOGLE_AI_STUDIO_API_KEY` - Your Google Gemini API key for Gemini models
- `OPENAI_API_KEY` - Your OpenAI API key (GPT models)
- `ANTHROPIC_API_KEY` - Your Anthropic API key (Claude models)
- `JWT_SECRET` - Secure random string for session management
- `WEBHOOK_SECRET` - Webhook authentication secret
- `SECRETS_ENCRYPTION_KEY` - Encryption key for secrets
- `SANDBOX_INSTANCE_TYPE` - Container performance tier (optional, see section below)
- `ALLOWED_EMAIL` - Email address of the user allowed to use the app
- `CUSTOM_DOMAIN` - Custom domain for your app (**Required**). If you use a first-level subdomain such as `abc.xyz.com`, make sure the Advanced Certificate Manager add-on is active on that zone.

### Custom domain DNS setup

To serve preview apps correctly, add the following DNS record in the zone that hosts `CUSTOM_DOMAIN`:

- Type: `CNAME`
- Name: `*.abc`
- Target: `abc.xyz.com` (replace with your base custom domain or another appropriate origin)
- Proxy status: **Proxied** (orange cloud)

Adjust the placeholder `abc`/`xyz` parts to match your domain. DNS propagation can take time—expect it to take up to an hour before previews resolve. This step may be automated in a future release, but it is required today.

### 🏗️ Sandbox Instance Configuration (Optional)

VibeSDK uses Cloudflare Containers to run generated applications in isolated environments. You can configure the container performance tier based on your needs and Cloudflare plan.

#### Available Instance Types

> **📢 Updated Oct 2025**: Cloudflare now offers [larger container instance types](https://developers.cloudflare.com/changelog/2025-10-01-new-container-instance-types/) with more resources!

| Instance Type | Memory | CPU | Disk | Use Case | Availability |
|---------------|--------|-----|------|----------|--------------|
| `lite` (alias: `dev`) | 256 MiB | 1/16 vCPU | 2 GB | Development/testing | All plans |
| `standard-1` (alias: `standard`) | 4 GiB | 1/2 vCPU | 8 GB | Light production apps | All plans |
| `standard-2` | 8 GiB | 1 vCPU | 12 GB | Medium workloads | All plans |
| `standard-3` | 12 GiB | 2 vCPU | 16 GB | Production apps | All plans (**Default**) |
| `standard-4` | 12 GiB | 4 vCPU | 20 GB | High-performance apps | All plans |

#### Configuration Options

**Option A: Via Deploy Button (Recommended)**
During the "Deploy to Cloudflare" flow, you can set the instance type as a **build variable**:
- Variable name: `SANDBOX_INSTANCE_TYPE`
- Recommended values:
  - **Standard/Paid users**: `standard-3` (default, best balance)
  - **High-performance needs**: `standard-4`

**Option B: Via Environment Variable**
For local deployment or CI/CD, set the environment variable:
```bash
export SANDBOX_INSTANCE_TYPE=standard-3  # or standard-4, standard-2, standard-1, lite
bun run deploy
```