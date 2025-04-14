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
