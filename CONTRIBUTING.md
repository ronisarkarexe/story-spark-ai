# **Contributing Guidelines** 📄

This documentation contains a set of guidelines to help you during the contribution process.
We are happy to welcome all the contributions from anyone willing to improve/add new scripts to this project.
Thank you for helping out and remember, **no contribution is too small.**
<br>
Please note we have a [code of conduct](CODE_OF_CONDUCT.md)  please follow it in all your interactions with the project.


<br>

## **Need some help regarding the basics?🤔**


You can refer to the following articles on basics of Git and Github and also contact the Project Mentors,
in case you are stuck:

- [Forking a Repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- [Cloning a Repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
- [How to create a Pull Request](https://opensource.com/article/19/7/create-pull-request-github)
- [Getting started with Git and GitHub](https://towardsdatascience.com/getting-started-with-git-and-github-6fcd0f2d4ac6)
- [Learn GitHub from Scratch](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources)

<br>

**1.** Fork [this](https://github.com/ronisarkarexe/story-spark-ai.git) repository.

**2.** Clone your forked copy of the project.

```
git clone https://github.com/<your_user_name>/story-spark-ai.git
```

**3.** Navigate to the project directory :file_folder: .

```
cd story-spark-ai
```

**4.** Add a reference(remote) to the original repository.

```
git remote add upstream https://github.com/ronisarkarexe/story-spark-ai.git
```

**5.** Check the remotes for this repository.

```
git remote -v
```

**6.** Always take a pull from the upstream repository to your main branch to keep it at par with the main project (updated repository).

```
git pull upstream main
```

**7.** Create a new branch.

```
git checkout -b <your_branch_name>
```

**8.** Perform your desired changes to the code base.

**9.** Track your changes:heavy_check_mark: .

```
git add .
```

**10.** Commit your changes .

```
git commit -m "Relevant message"
```

**11.** Push the committed changes in your feature branch to your remote repo.

```
git push -u origin <your_branch_name>
```

**12.** To create a pull request, click on `compare and pull requests`.

**13.** Add appropriate title and description to your pull request explaining your changes and efforts done.

**14.** Click on `Create Pull Request`.
   
<br>

### Alternatively contribute using GitHub Desktop

1. **Open GitHub Desktop:**
   Launch GitHub Desktop and log in to your GitHub account if you haven't already.

2. **Clone the Repository:**
   - If you haven't cloned the story-spark-ai repository yet, you can do so by clicking on the "File" menu and selecting "Clone Repository."
   - Choose the story-spark-ai repository from the list of repositories on GitHub and clone it to your local machine.

3. **Switch to the Correct Branch:**
   - Ensure you are on the branch that you want to submit a pull request for.
   - If you need to switch branches, you can do so by clicking on the "Current Branch" dropdown menu and selecting the desired branch.

4. **Make Changes:**
   Make your changes to the code or files in the repository using your preferred code editor.

5. **Commit Changes:**
   - In GitHub Desktop, you'll see a list of the files you've changed. Check the box next to each file you want to include in the commit.
   - Enter a summary and description for your changes in the "Summary" and "Description" fields, respectively. Click the "Commit to <branch-name>" button to commit your changes to the local branch.

6. **Push Changes to GitHub:**
   After committing your changes, click the "Push origin" button in the top right corner of GitHub Desktop to push your changes to your forked repository on GitHub.

7. **Create a Pull Request:**
   - Go to the GitHub website and navigate to your fork of the story-spark-ai repository.
   - You should see a button to "Compare & pull request" between your fork and the original repository. Click on it.

8. **Review and Submit:**
   - On the pull request page, review your changes and add any additional information, such as a title and description, that you want to include with your pull request.
   - Once you're satisfied, click the "Create pull request" button to submit your pull request.

9. **Wait for Review:**
    Your pull request will now be available for review by the project maintainers. They may provide feedback or ask for changes before merging your pull request into the main branch of the story-spark-ai repository.

⭐️ Support the Project
If you find this project helpful, please consider giving it a star on GitHub! Your support helps to grow the project and reach more contributors.

## **Issue Report Process 📌**

1. Go to the project's issues.
2. Give proper description for the issues.
3. Don't spam to get the assignment of the issue 😀.
4. Wait until someone is looking into it ! 
5. Start working on issue only after you got assigned that issue 🚀.

<br>

However, it's important to adhere to strict regulations to maintain the integrity of our contributor records:

1. Only Add Your Details: You are allowed to add your own details to the ContributorsData.ts file. This helps us accurately attribute contributions to the right individuals.

2. Respect Others' Details: Modifying or tampering with existing contributor details is strictly prohibited. Any unauthorized changes may result in your PR not being merged or accepted.

We understand that open source collaboration is filled with excitement and fulfillment. Your contributions are invaluable, and we're committed to ensuring that your efforts are duly recognized and appreciated.

## **Pull Request Process 🚀**

1. Ensure that you have self reviewed your code 😀
2. Make sure you have added the proper description for the functionality of the code
3. Ensure you have commented your code, particularly in hard-to-understand areas.
4. Add screenshots — they help in the review process.
5. Submit your PR by giving the necessary information in PR template and hang tight we will review it really soon 🚀

<br>

## **Frequently Asked Questions**

1. **Do I need to get assigned before working on an issue?**
   - Yes. Please wait until a maintainer assigns the issue to you before starting work. Contributions made without assignment may not be accepted if another contributor is already working on the same issue.
2. **My Pull Request has merge conflicts. What should I do?**
   - Update your branch with the latest changes from the upstream repository, resolve the conflicts locally, and push the updated branch.
3. **Can I directly push changes to the main branch?**
   - No. Always create a separate branch for your work and open a Pull Request from that branch.
4. **How long does it take for a Pull Request to be reviewed?**
   - Review times vary depending on maintainer availability and project activity. Please be patient and avoid repeatedly asking for reviews.

<br>

# **Thank you for contributing💗** 