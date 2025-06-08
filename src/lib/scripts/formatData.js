export const formatData = (data, isHalfModel = false) => {
    return data.map(item => {
        const formattedItem = {
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

        // Only add coordinates of Rotterdam if it's a halfmodel
        if (isHalfModel) {
            formattedItem.latitude = "51.926517";
            formattedItem.longitude = "4.462456";
            formattedItem.location = `Rotterdam, ${item.Location}`
        }

        return formattedItem;
    });
};

export const formatDataBatavia = (data) => {
  return data.map(item => {
    const originalFelling = item['Interpret./ felling'] || '';

    // Match the first 4-digit year and insert (1628) after it
    const fellingDate = originalFelling.replace(/(\b\d{4}\b)/, '$1 (1628)');

    return {
      keyCode: item.Dendrocode,
      location: "Amsterdam, Batavia shipwreck",
      length: item.N,
      startYear: item['start yr.'],
      endYear: item['end yr.'],
      fellingDate: fellingDate,
      provenance: item.Provenance,
      pith: item.pith,
      SW: item.SW,
      bark: item['bark?'],
      extraEnd: item['extra end'],
    };
  });
};

export const formatDataSjoerd = (data) => {
  return data.map(item => {
    let provenance = item.Provenance;
    let endYear = item.DateS;
    let location = item.Site;

    if (provenance === "NW Germany") {
      provenance = "Northwest Germany";
    } else if (provenance === "Southern Germany") {
      provenance = "South Germany";
    } else if (provenance === "Southeast Lithuania") {
      provenance = "Lithuania";
    } else if (provenance === "Poland") {
      provenance = "Gdansk, Poland";
    }

    if(item.EndYear && item.EndYear !== "") {
      endYear = item.EndYear;
    }

    if(item.Location && item.Location !== "") {
      location = item.Location;
    }

    return {
      keyCode: item.SampleCode,
      objectType: item.Category,
      location: location,
      latitude: item.Latitude?.toString().replace(',', '.'),
      longitude: item.Longitude?.toString().replace(',', '.'),
      length: item.Length,
      sapwood: item.Sapwood,
      WK: item.WK,
      startYear: item.StartYear,
      endYear: endYear,
      fellingDate: item['Estimated felling date'],
      TBP: item.TBP,
      reference: item.Reference,
      provenance: provenance,
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
// get FellingDates
export const getFellingDates = (dataSet, name) => {
  const rawFellingDates = dataSet.map(item => item.fellingDate).filter(Boolean);

  const extractYear = (data) => {
    if (typeof data === "string") {
      // First try to find a year in parentheses (e.g., (1628))
      let match = data.match(/\((\d{4})\)/);
      if (match) {
        return parseInt(match[1], 10);
      }
      // Fallback: first 4-digit number anywhere in the string
      match = data.match(/(\d{4})/);
      return match ? parseInt(match[1], 10) : null;
    }
    if (typeof data === "number") {
      return data;
    }
    return null;
  };

  const earliestYears = rawFellingDates
    .map(extractYear)
    .filter(Boolean); // Remove nulls

  return earliestYears.sort();
};

// get unique locations, when they are the first word of the location key
export const getUniqueLocations = (datasets) => {
  const allItems = datasets.flat();

  const values = allItems
    .map(item => item['location'])
    .filter(value => value && value.trim() !== "")
    .map(rawValue => {
      // Remove commas and trim whitespace first
      const cleanValue = rawValue.replace(/,/g, '').trim().toLowerCase();

      // Extract the first word
      let part = cleanValue.split(" ")[0];

      // Special case: if "den", include the next word
      if (part === 'den') {
        const parts = cleanValue.split(" ");
        const nextWord = parts[1] || '';
        part = `den ${nextWord}`;
      }

      if (part === 'alphen') {
        part = 'Alphen aan den Rijn'
      }

      if(part === 'de') {
        part = 'De Bilt'
      }

      return part;
    });

  const uniqueSet = new Set(values);
  const uniqueArray = Array.from(uniqueSet);

  const normalizedArray = uniqueArray.map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );

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

export function getCategoryPathCombined(tree, routeData, keywordMap) {
  if (routeData.objectType) {
    const pathFromObjectType = findCategoryPathFromObjectType(tree, routeData.objectType);
    if (pathFromObjectType) return pathFromObjectType;
  }

  if (routeData.location) {
    return findCategoryPathFromLocation(tree, routeData.location, keywordMap);
  }

  return ['Uncategorized'];
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

export function findCategoryPathFromObjectType(tree, objectType) {
  const objectTypeMap = {
    A: 'Archeology',
    P: 'Panel paintings',
    Sc: 'Sculptures',
    S: 'Shipwrecks',
    C: 'Constructions',
    F: 'Furniture'
  };

  const targetLabel = objectTypeMap[objectType];
  if (!targetLabel) return null;

  return findCategoryPath(tree, targetLabel);
}

export function countDataPoints(dataSets) {
    let count = 0;

    dataSets.forEach(category => {
        if (Array.isArray(category.data)) {
            category.data.forEach(subset => {
                if (Array.isArray(subset.data)) {
                    // subset.data is an array of datapoints
                    count += subset.data.length;
                } else {
                    console.warn("Unexpected data structure:", subset);
                }
            });
        } else {
            console.warn("Unexpected data structure:", category);
        }
    });

    return count;
}

export function countFlatDataPoints(dataSets) {
  let count = 0;

  dataSets.forEach(set => {
    if (Array.isArray(set.data)) {
      count += set.data.length;  // Directly count the datapoints here
    } else {
      console.warn("Unexpected data structure:", set);
    }
  });

  return count;
}



