# react-maps

A React map component library for ATOM and Locus.

# Setup


1. [`yarn`](http://yarnpkg.com) - (Recommended Version: 1.22) for dependency management
    - Install yarn (mac):
        - Open Command Line
        - Via [`Homebrew`](https://brew.sh/):
          ```
          brew install yarn
          ```
        - Via [`MacPorts`](https://brew.sh/):
          ```
          sudo port install yarn
          ```
        - Via `Installation Script` (zsh):
          ```
          curl -o- -L https://yarnpkg.com/install.sh | bash
          ```git
          ```
          curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version [version]
          ```
    - Install yarn (Windows):
        - Via `Chocolatey`:
          ```
          choco install yarn
          ```
        - Via `Scoop`:
          ```
          scoop install yarn
          ```
    - To Install yarn on other Operating Systems or different options, please navigate [`here`](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

2. Environment variables:

    Here is the sample of `.env`
    ```
    MAPBOX_ACCESS_TOKEN="your mapbox key"
    STORYBOOK_API_HOST=
    STORYBOOK_API_STAGE=
    KEY_WARDEN_HOST=<keywarden api>
    ```

3. Storybook:

    Use `yarn && yarn storybook` to run react-map component on storybook.
