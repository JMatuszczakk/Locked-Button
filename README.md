# Lock Numpad Card

A custom card for Home Assistant with a numeric keypad for secure code entry.

![screenshot of the locked button](https://github.com/JMatuszczakk/Locked-Button/blob/main/image.png?raw=true)
## Features

- Password-protected actions in your Home Assistant dashboard
- Alarm system style numeric keypad with special action buttons
- Visual feedback with dot indicators
- X button closes the modal without action
- ✓ button submits the current code for validation
- Automatic submission when code reaches expected length
- Customizable success message and button label
- Execute any Home Assistant service upon successful code entry

## Installation

### Manual Installation

1. Download `locked-button.js` from this repository
2. Copy the file to your Home Assistant configuration directory under `www/`
3. Add the following to your `configuration.yaml` file:

```yaml
lovelace:
  resources:
    - url: /local/locked-button.js
      type: module
```

4. Restart Home Assistant

### HACS Installation

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add the URL of this repository
6. Select "Lovelace" as the category
7. Click "ADD"
8. Find and install "Lock Numpad Card"

## Usage

Add the card to your dashboard with the following configuration:

```yaml
type: custom:lock-numpad-card
code: "1234"
button_label: "Enter Code"
success_message: "Code Accepted ✓"
action:
  service: light.turn_on
  data:
    entity_id: light.living_room
```

### Keypad Layout

The keypad follows a clean alarm system layout:

```
1 2 3
4 5 6
7 8 9
✕ 0 ✓
```

- **Numeric buttons (0-9)**: Enter digits for your code
- **✕ button (red)**: Close the modal/cancel operation
- **✓ button (green)**: Submit the current code for validation

The code is automatically submitted when you enter the full expected length, or you can manually submit using the ✓ button.

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| code | string | Required | The code that must be entered |
| button_label | string | "Enter Code" | Label for the main button |
| success_message | string | "Code Accepted ✓" | Message shown when code is correct |
| action | object | Required | The service to call when code is correct |
| action.service | string | Required | Service in `domain.service` format |
| action.data | object | Optional | Data to pass to the service |

## Examples

### Control a Lock

```yaml
type: custom:lock-numpad-card
code: "4321"
button_label: "Unlock Door"
success_message: "Door Unlocked!"
action:
  service: lock.unlock
  data:
    entity_id: lock.front_door
```

### Arm Home Alarm

```yaml
type: custom:lock-numpad-card
code: "9876"
button_label: "Arm Alarm"
success_message: "Alarm System Armed"
action:
  service: alarm_control_panel.alarm_arm_away
  data:
    entity_id: alarm_control_panel.home_alarm
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.