export const formatData = (data) => {
    return data.map(item => {
        return {
        keyCode: item.Keycode,
        location: item.Location,
        individualOrCluster: item['Individual/Cluster'],
        length: item.Length,
        startYear: item.StartYear,
        endYear: item.EndYear,
        sapwood: item.Sapwood,
        WK: item.WK,
        fellingDate: item['Felling date'],
        TBP: item.TBP,
        Gl: item.Gl,
        SL: item.SL,
        reference: item.Reference,
        provenance: item.Provenance,
        minValueMM: item['Min.Value mm'],
        maxValueMM: item['Max.Value mm'],
        meanValueMM: item['Mean Value mm'],
        stdDevMm: item['Std.Dev. Mm'],
        };
    });
}

export const getUniqueValues = (data, key) => {
    const values = data
        .map(item => item[key])
        .filter(value => value !== "");

    const uniqueSet = new Set(values);
    const uniqueArray = Array.from(uniqueSet);
    const sortedArray = uniqueArray.sort();
    return sortedArray ;
}

// get FellingDates
export const getFellingDates = (dataSet) => {
    const rawFellingDates = dataSet.map(item => item.fellingDate).filter(Boolean);

    const earliestYears = rawFellingDates.map(data => {
        if (typeof data === "string") {
            return parseInt(data.substring(0, 4));
        }
        return data;
    }).filter(Boolean); // Remove nulls

    return earliestYears.sort();
};

// get unique locations, when they are the first word of the location key
export const getUniqueLocations = (data) => {
    const values = data
        .map(item => item['location'])
        .filter(value => value !== "")
        .map(value => {
            // Remove commas, convert to lowercase, and take the first word
            let part = value
                .replace(/,/g, '') 
                .toLowerCase()
                .split(" ")[0];

            // If the first word is "den", include the next word
            if (part === 'den') {
                let nextWord = value.split(' ')[1];
                part = part + ' ' + nextWord.toLowerCase();
            }

            return part;
        });

    // Get unique values
    const uniqueSet = new Set(values);
    const uniqueArray = Array.from(uniqueSet);

    // Capitalize first letter of each unique location
    const normalizedArray = uniqueArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Sort the array alphabetically
    const sortedArray = normalizedArray.sort();

    console.log("locations", sortedArray);
    return sortedArray;
};

export function findCategoryPathFromLocation(tree, location, keywordMap) {
  const lowerLoc = location.toLowerCase();

  // Step 1: Find all matching English labels based on Dutch keywords
  const matchedLabels = [];

  for (const [englishLabel, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lowerLoc.includes(keyword)) {
        matchedLabels.push(englishLabel);
        break;
      }
    }
  }

  // Step 2: Try to find a path in the tree for each matched label
  for (const label of matchedLabels) {
    const path = findCategoryPath(tree, label);
    if (path) return path;
  }

  // Step 3: Optional fallback
  return ['Uncategorized'];
}

// Your original recursive tree search remains unchanged
export function findCategoryPath(tree, targetLabel, path = []) {
  for (const key in tree) {
    const newPath = [...path, key];

    if (key === targetLabel) {
      return newPath;
    }

    const child = tree[key];
    if (child && typeof child === 'object') {
      const result = findCategoryPath(child, targetLabel, newPath);
      if (result) return result;
    }
  }

  return null;
}

