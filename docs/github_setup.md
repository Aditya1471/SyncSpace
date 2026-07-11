# GitHub Remote Repository Setup Guide

Follow these steps to create your remote GitHub repository and push the local codebase we have initialized.

---

## Step 1: Create the Repository on GitHub

1. Go to [github.com](https://github.com/) and log into your account.
2. In the top-right corner, click the **`+`** icon and select **New repository**.
3. Fill in the repository details:
   - **Repository name**: `SyncSpace`
   - **Description**: `Collaborative whiteboard and code editor workspace.`
   - **Visibility**: Select **Private** (recommended) or **Public**.
   - **Initialize this repository with**: **Do NOT check** README, .gitignore, or License (since we have already initialized these locally).
4. Click **Create repository**.

---

## Step 2: Link the Local Repository & Push

Open your terminal in the root of the project (`C:\Users\iamad\OneDrive\Desktop\SyncSpace`) and run the following commands:

1. **Link the remote repository**:
   ```bash
   git remote add origin <your-github-repo-url>
   # Example: git remote add origin https://github.com/your-username/SyncSpace.git
   ```

2. **Push the `main` branch**:
   ```bash
   git checkout main
   git push -u origin main
   ```

3. **Push the `development` branch**:
   ```bash
   git checkout development
   git push -u origin development
   ```

Now, your teammates can clone the repository using:
```bash
git clone <your-github-repo-url>
```
And then create their feature branches from `development`!
