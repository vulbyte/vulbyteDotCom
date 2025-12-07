#include <iostream>
#include <fstream>
#include <filesystem>
#include <vector>
#include <algorithm>
#include <string>
#include <set> // Required for the exclusion list

namespace fs = std::filesystem;

// Define the directory names to exclude globally or pass them through a struct/class.
// Using a global set here for simplicity, but passing it as an argument to scanDirectory is safer.
// Let's define the set of excluded directory names here:
const std::set<std::string> EXCLUDE_DIRS = {
	"build",
	".git", 
	"temp", 
    "node_modules", 
	".vscode",
	"~",
    // Add any other directory names you want to skip.
};

// --- Helper Functions (Same as before) ---

// Function to generate the HTML header (No CSS, includes requested Script)
void writeHeader(std::ofstream& file) {
    file << "<!DOCTYPE html>\n"
         << "<html lang=\"en\">\n"
         << "<head>\n"
         << "    <meta charset=\"UTF-8\">\n"
         << "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
         << "    <title>Site Map</title>\n"
         << "    <script src=\"client_management.js\" type=\"module\"></script>\n"
         << "</head>\n"
         << "<body>\n"
         << "    <h1>Site Map</h1>\n";
}

// Function to generate the HTML footer
void writeFooter(std::ofstream& file) {
    file << "</body>\n"
         << "</html>";
}

// --- Core Recursive Function (Modified) ---

void scanDirectory(const fs::path& currentDir, const fs::path& rootDir, std::ofstream& outFile) {
    
    // Check if the current directory name itself is in the exclude list (optional, 
    // but useful if the starting directory matches a pattern, or if you call 
    // this recursively on the root's children)
    if (EXCLUDE_DIRS.count(currentDir.filename().string())) {
        return; // Skip this entire directory and all its contents
    }

    // Collect and sort entries
    std::vector<fs::directory_entry> entries;
    try {
        for (const auto& entry : fs::directory_iterator(currentDir)) {
            entries.push_back(entry);
        }
    } catch (const fs::filesystem_error& e) {
        std::cerr << "Error accessing: " << currentDir << " (" << e.what() << ")\n";
        return;
    }

    std::sort(entries.begin(), entries.end(), [](const fs::directory_entry& a, const fs::directory_entry& b) {
        return a.path().filename() < b.path().filename();
    });

    outFile << "<ul>\n";

    for (const auto& entry : entries) {
        const auto& path = entry.path();
        std::string filename = path.filename().string();

        if (entry.is_directory()) {
            
            // **EXCLUSION CHECK:** Check if the directory name is in the set
            if (EXCLUDE_DIRS.count(filename)) {
                // If the directory name is in the set, skip it and continue to the next entry.
                continue; 
            }
            
            // Handle Directories
            outFile << "<li><strong>" << filename << "/</strong>\n";
            scanDirectory(path, rootDir, outFile); // Recursive call
            outFile << "</li>\n";
        } 
        else if (entry.is_regular_file()) {
            // Handle HTML Files
            std::string ext = path.extension().string();
            
            if (ext == ".html" || ext == ".htm") {
                if (filename == "sitemap.html") continue;

                fs::path relativePath = fs::relative(path, rootDir);

                outFile << "<li><a href=\"" << relativePath.string() << "\">" 
                        << filename << "</a></li>\n";
            }
        }
    }

    outFile << "</ul>\n";
}

// --- Main Function (Same as before) ---

int main(int argc, char* argv[]) {
    std::string pathString;

    if (argc > 1) {
        pathString = argv[1];
    } else {
        std::cout << "Enter the directory path to scan: ";
        std::getline(std::cin, pathString);
    }

    fs::path rootDir(pathString);

    if (!fs::exists(rootDir) || !fs::is_directory(rootDir)) {
        std::cerr << "Error: Path does not exist or is not a directory.\n";
        return 1;
    }

    fs::path outputPath = rootDir / "sitemap.html";
    std::ofstream outFile(outputPath);

    if (!outFile.is_open()) {
        std::cerr << "Error: Could not create sitemap.html\n";
        return 1;
    }

    writeHeader(outFile);
    
    std::cout << "Generating tree for: " << rootDir << " (Excluding directories: ";
    for (const auto& dir : EXCLUDE_DIRS) {
        std::cout << dir << " ";
    }
    std::cout << ")\n";
    
    scanDirectory(rootDir, rootDir, outFile);

    writeFooter(outFile);
    outFile.close();

    std::cout << "Done! Sitemap saved to: " << outputPath << "\n";

    return 0;
}
