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

export const formatDataBatavia = (data) => {
  return data.map(item => {
    return {
      keyCode: item.Dendrocode,
      location: "Amsterdam, Batavia shipwreck",
      length: item.N,
      startYear: item['start yr.'],
      endYear: item['end yr.'],
      fellingDate: item['Interpret./ felling'],
      provenance: item.Provenance,
      pith: item.pith,
      SW: item.SW,
      bark: item['bark?'],
      extraEnd: item['extra end'],
    }
  })
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
export const getFellingDates = (dataSet, name) => {
  const rawFellingDates = dataSet.map(item => item.fellingDate).filter(Boolean);
  let earliestYears;

  if (name === "shipwrecksBatavia") {
    earliestYears = rawFellingDates
      .map(data => {
        if (typeof data === "string") {
          // Match 4-digit year in the string
          const match = data.match(/\b\d{4}\b/);
          return match ? parseInt(match[0], 10) : null;
        }
        return null;
      })
      .filter(Boolean); // Remove nulls
  } else {
    earliestYears = rawFellingDates
      .map(data => {
        if (typeof data === "string") {
          return parseInt(data.substring(0, 4), 10);
        }
        return data;
      })
      .filter(Boolean); // Remove nulls
  }

  return earliestYears.sort();
};

// get unique locations, when they are the first word of the location key
export const getUniqueLocations = (datasets) => {
  // Flatten all data items from all datasets into a single array
  const allItems = datasets.flat();

  // Extract, clean, and normalize location values
  const values = allItems
    .map(item => item['location'])
    .filter(value => value !== "")
    .map(value => {
      let part = value
        .replace(/,/g, '') 
        .toLowerCase()
        .split(" ")[0];

      // If the first word is "den", include the next word
      if (part === 'den') {
        const nextWord = value.split(' ')[1];
        part = part + ' ' + (nextWord ? nextWord.toLowerCase() : '');
      }

      return part;
    });

  // Get unique values
  const uniqueSet = new Set(values);
  const uniqueArray = Array.from(uniqueSet);

  // Capitalize first letter of each unique location
  const normalizedArray = uniqueArray.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Sort the array alphabetically
  const sortedArray = normalizedArray.sort();

  return sortedArray;
};

export function findCategoryPath(tree, targetLabel, path = []) {
  for (const key in tree) {
    const newPath = [...path, key];

    if (key === targetLabel) {
      return newPath;
    }

    const child = tree[key];
    if (child && typeof child === 'object') {
      const result = findCategoryPath(child, targetLabel, newPath);
      if (result) {
        return result;
      }
    }
  }

  return null; // Not found
}

export function findCategoryPathFromLocation(tree, location, keywordMap) {
  const lowerLoc = location.toLowerCase();

  // Step 1: Collect all matched labels
  const matchedLabels = new Set();

  for (const [englishLabel, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lowerLoc.includes(keyword)) {
        matchedLabels.add(englishLabel);
        break;
      }
    }
  }

  // Step 2: Special case for Halfmodels
  if (lowerLoc.includes('ng-mc') || lowerLoc.includes('indet')) {
    const halfmodelPath = findCategoryPath(tree, 'Halfmodels');
    if (halfmodelPath) return halfmodelPath;
  }

  // Step 3: Find the deepest path that includes one or more matched labels
  let bestPath = null;

  function dfs(node, path = []) {
    for (const key in node) {
      const newPath = [...path, key];
      const child = node[key];

      if (matchedLabels.has(key)) {
        if (!bestPath || newPath.length > bestPath.length) {
          bestPath = newPath;
        }
      }

      if (child && typeof child === 'object') {
        dfs(child, newPath);
      }
    }
  }

  dfs(tree);

  if (!bestPath) {
        if (lowerLoc && lowerLoc !== '' && !lowerLoc.includes('ng-mc') && !lowerLoc.includes('indet')) {
            const constructionsPath = findCategoryPath(tree, 'Constructions');
            if (constructionsPath) return constructionsPath;
        }
  }

  return bestPath || ['Uncategorized'];
}

