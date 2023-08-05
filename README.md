# Unomok-Task-Log-digestion
A Node.js script to analyze API logs and generate statistics based on endpoints, timestamps, and status codes.

## Prerequisites

- Node.js (v14 or higher)

## Installation

Clone the repository:

```bash
git clone https://github.com/Deepa-Reddy-K/Unomok-Task-Log-digestion.git
cd Unomok-Task-Log-digestion
```

## Dependencies

- The code uses `fs/promises`, `path`, `moment`, and `process`, which are built-in Node.js modules and don't require installation.
- If its haven't already installed install the @types/node package for TypeScript type definitions. Run the following command to install it as a development dependency:
```
npm install --save-dev @types node
```

## Usage

To use the log analyzer tool, follow these steps:
- Put the log file `prod-api-prod-out.log` to analyze in the root directory of the project
- Run the analysis script :
  `npm start`
  
## License

This project is licensed under the ISC License
