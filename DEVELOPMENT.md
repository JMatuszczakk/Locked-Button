# Development Guide

This guide will help you set up the development environment for the Lock Numpad Card.

## Prerequisites

- [Git](https://git-scm.com/)
- A code editor (like [Visual Studio Code](https://code.visualstudio.com/))
- Basic knowledge of JavaScript, HTML, and CSS
- Familiarity with Home Assistant

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/JMatuszczakk/Locked-Button.git
cd Locked-Button
```

2. Start developing. The main file is `dist/locked-button.js`.

## Testing Your Changes

### Local Development

1. Copy the `locked-button.js` file to your Home Assistant's `www` directory:

```bash
cp dist/locked-button.js /path/to/your/homeassistant/www/
```

2. Add the resource to your Lovelace configuration:

```yaml
resources:
  - url: /local/locked-button.js
    type: module
```

3. Add a test card to your Lovelace UI:

```yaml
type: custom:lock-numpad-card
code: "1234"
button_label: "Test Button"
success_message: "Test Success"
action:
  service: light.toggle
  data:
    entity_id: light.living_room
```

4. Refresh your browser to see the changes.

## Code Structure

- The component is based on [LitElement](https://lit-element.polymer-project.org/), a simple base class for creating web components.
- The main class `LockNumpadCard` extends `LitElement`.
- Key methods:
  - `setConfig()`: Validates and sets the configuration
  - `_handlePress()`: Handles button presses and code validation
  - `render()`: Defines the card's HTML structure
  - `static get styles()`: Defines the card's CSS

## Contributing

1. Create a feature branch:

```bash
git checkout -b feature-name
```

2. Make your changes
3. Test your changes
4. Commit your changes:

```bash
git commit -m "Description of changes"
```

5. Push to GitHub:

```bash
git push origin feature-name
```

6. Create a Pull Request on GitHub

## Building for Production

For production use, you can simply use the file in the `dist` directory. No build step is required as the component is written in vanilla JavaScript with LitElement.

## Release Process

1. Update version number in appropriate files
2. Create a new release on GitHub
3. Tag the release with a version number (e.g., v1.0.0)

Thank you for contributing to the Lock Numpad Card!