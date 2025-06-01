# Character Generator API Documentation

Welcome to the unofficial documentation for the Character Generator API. This API empowers you to dynamically generate distinct characters, complete with metadata. Below is an extensive guide on effectively utilising this API.

## Quick Links for Testing

To generate characters, manipulate the seed value in the URL, determining the character's properties. Repeating the same seed will yield the identical character. Below are quick links for testing:

**Note: This is folk from the original version. Only focused on text generation with no image process**

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js installed on your machine (recommend npm v20)

### Installing

1. Clone the repository:

    ```bash
    git clone https://github.com/ITsPorky/Character-Generation-API.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Character-Generation-API
    ```

3. Install dependencies:

    ```bash
    npm install
    ```
    OR
    ```bash
    npm i
    ```

### Running the App

1. Start the development server:

    ```bash
    npm start
    ```

2. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### Understanding Response Types

This API provides various response types for creating diverse characters. It includes different versions for generating distinct styles of character design:

##### Character Metadata (format: `JSON`)

To retrieve Character Metadata, use the URL format: `/seed/{seed_value}/metadata`.

- `/seed` generates character data for a given seed value.
- `{seed_value}` is the seed value for character generation.
- `metadata` instructs the API to return the metadata JSON.

This response includes all generated character information, such as character card URL, character sprite URL, weapon sprite URL, and additional data not displayed on the character card.

## Features

This API provides numerous features for creating unique characters, including:

- Random Character Stats (Based on RPGs like Dungeons & Dragons).
- Stat Modifiers (Based on stat values).
- Random Character General Information.
- Random Character names.
- Weapons based on class.
- Weapon information categorized by rarity (bronze, silver, gold, purple).
- Character card rarity determined by character stats (bronze, silver, gold, purple).
- Random weapon modifier (Based on weapon type).
- Random Clothes/Armor pieces (Head, Chest, Legs) with random armor class (AC contributing to character stats).

## Project Overview

This section provides an overview of the key learnings and challenges encountered during the development of this project.

#### Key Learnings

Throughout the course of this project, I acquired valuable skills and knowledge in the following areas:

- Proficiency in performing data exchange through URL API calls.
- Mastery of setting up routes using node.js and express.js to efficiently handle and deliver requested data.
- Implementation of data sanitization techniques, leveraging Regular Expressions (RegEx) to ensure the acceptance of only authorized data.
- Enhanced skills in crafting comprehensive documentation, emphasizing the importance of documenting the project concurrently with its development to capture crucial information.
- Utilization of SHA-256 and manipulation of big numbers for secure and efficient data handling.

#### Overcoming Challenges

In the pursuit of project completion, several challenges were encountered and successfully addressed:

- **Challenge 1: Node.js and API Routing**
  - Overcame by dedicating time to learn and research the intricacies of node.js and the establishment of API routes. Reference to existing documentation and other APIs played a pivotal role in achieving proficiency.

- **Challenge 2: SHA-256 and Big Numbers**
  - Successfully addressed by investing time in acquiring an understanding of SHA-256 and big number manipulation. Extensive research and practical application were undertaken to ensure their effective utilization in the character generation process.

I hope this documentation was helpful, feel free to try it out.