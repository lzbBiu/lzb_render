export async function loadObjText(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", path);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          }
        };
        xhr.send();
    });
}

export async function loadImg(path: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
        let img = new Image();
        img.onload = function () {
          resolve(img);
        };
        img.src = path;
    });
}