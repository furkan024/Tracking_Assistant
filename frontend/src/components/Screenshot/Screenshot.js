import React, { createRef } from "react";
import Text from "./Text";
import { useScreenshot, createFileName } from "use-react-screenshot";

export default () => {
  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/*",
    quality: 1.0
  });

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    console.log(image);
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  return (
    <div>
      <button onClick={downloadScreenshot}>Download screenshot</button>
      <div
        ref={ref}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px"
        }}
      >
        fsdfsdfs asdasd asdasdas
      </div>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuYAAAAoCAYAAACy5D++AAALI0lEQVR4Xu3dB2hW1x/G8Z+idcaquK174MYacSKCuPfeWlQQF4oW6564cO8t7oFb3ANa1Drjrq3BbcUqToy42/x5Drzh5f3njW80IVfzvRAEc997z/ncG3jOye+cpIiMjIyOiooyDgQQQAABBBBAAAEEEEgagbCwMEsRERERHR4enjQt4K4IIIAAAggggAACCCBg586dI5jzHiCAAAIIIIAAAgggkNQCBPOkfgLcHwEEEEAAAQQQQAABM2bMeQsQQAABBBBAAAEEEPCCADPmXngKtAEBBBBAAAEEEEAg2QsQzJP9KwAAAggggAACCCCAgBcECOZeeAq0AQEEEEAAAQQQQCDZCxDMk/0rAAACCCCAAAIIIICAFwQI5l54CrQBAQQQQAABBBBAINkLEMyT/SsAAAIIIIAAAggggIAXBAjmXngKtAEBBBBAAAEEEEAg2Qt8djC/c+eOTZgwwf7++28bM2aMVatW7ZOYr169smnTptmMGTNs+vTp1qtXr5jPzJs3z37//Xf7/vvvbcmSJZ+8lk44ePCgu9bly5ft4cOHMZ/5nLaFdMMQTgrWphA+GvSUa9eu2axZs2zp0qX2119/WYkSJb7kckE/u2jRIps9e7b9+OOPtmnTpgS5R2J4JEjDuAgCCCCAAAIIIOAxgc8O5gpvCxcutNSpU7tQ3Lhx45C79sMPP9jIkSNjgvnOnTtNoVAhbuzYse4r1GP58uXuWv7B/EvaFup94zovtjZ96XVv3LhhxYoVS9RgrjZ27tzZPn78mGDBXNdMDI8v9eTzCCCAAAIIIICA1wQ+K5jfvXvXChYsaI8fP7Zs2bLFu0+Bwbxbt26WIUMGmz9/fryvFRj6vrRt8W5ALB9IjCBKME+IJ8M1EEAAAQQQQAAB7wp8VjA/efKkK115/vy5Zc6cOd69K1CggA0bNixmxrxevXpWsmRJV0YR32PlypXuWr4Z8y9tW3zvH9v5gW1KiGvevn3bChcunOgz5j/99JO9e/cuQWfME8MjIUy5BgIIIIAAAggg4CWBeAdz1YFPmjTJ9u3bZw0bNnSlLNu3b7e9e/e6OmjNoN+6dcvGjRtnjRo1cn2dM2eOrVq1yhTIM2bMaLt27XK15qoxV6hesWKFhYWFWdmyZa1t27bWsWNHV79+7Ngxd75mi1XmkitXLlNA7du3r0VFRZlm3u/du2c3b950wTxY265fv279+/d3g4h//vnHatWqFbRcpl27dvb27VtLly6du9fq1atdTffr16+tR48eLrTq67///rP9+/e7/sXVJn1f9fQHDhyw3Llz29WrV23UqFHWokUL99lg/Xzz5o0NGjTIzp496wK5ykt27NgRNJj/+uuvNmLECCtSpIjzqlOnjo0fP97dIzIyMmj/jxw54j6XJUsWy5o1q505c8YqVqwYE8y94uGlHxraggACCCCAAAIIJIZAvIO5GnH8+HGrUaNGzIz5v//+60LdiRMnrHTp0qbFihcvXrT27dvb7t27rUOHDm6BpgKmjsBSltq1a1uZMmViZswVRps2beoWlqZKlcoF97p161q+fPlcaKxUqZKrb9cRWDYS2DadowGCBhEK9GqrBhYKx7EdCrOjR49232rVqpVlypTJNOOrgYRC65YtW9z3/GvhP9Um3e+XX35xfdEi15kzZ7owH1c/f/75Z/vtt9+ctQYJnyplkbNcVV9/5coVK1eunGkRrAZDwfr/6NEjK1SokBs0aUCkI7DG3CseifHyc00EEEAAAQQQQMBLAgkSzDW7qxnvtWvXuhDufygQa9Z78+bNMf/9qWB+6NAhN6N86dIlK1q0aMznFIwrV67sZp1LlSoVcjBX2Y2CqhaYpkiRImT/fv36udl4zYwPHz7czdofPXrU1cP7jlDa5H/DrVu3WpcuXUxmwfoZHR3tPKdOnWp9+vRxH/9UMPe/x5MnTyx79ux26tQp5xWs/7q+Bgn6LYLPJa7Fn0nlEfID40QEEEAAAQQQQOArFkiQYK7+K7QtWLDAatasaT179nTlKDqKFy9uLVu2tClTpoQczBVadR3Nsjdv3twGDBhgVatWtQ0bNlinTp1cqE2bNm3IwVxb/ylwKuR3797dzZz7h2tfw1Quou0Xz58/78peVBqjQYTKUFQOUr16dRdg1QaVmeTPnz+kNimM60thW4tTFe5VLhOsnw8ePLC8efO6AUH9+vVDCuYXLlxwIfu7775zvxVQCY7q7atUqeLKUmLrv56TjBXgfYd/MPeKx1f880XTEUAAAQQQQACBkAUSLJjrjgp4KjtRKFQpxuTJk93uLQqyEydODDmY60SFQpVnaE/zw4cP2549e0ylF9rBRTXeCqA6Qill0XkqHVHJhgYPGiwodAfOnmsGWW0XioK/BhuaqVYw1/HixQvbuHGj2z1GNe1//PGHm0WPq02nT592ZT/af1z13wroCr8K5sH6qYWwKjHRjLpqxXXENWOuaynIq8a/a9eu5psx9wXzYP1Xu1V/L4vYgrlXPBo0aBDyC82JCCCAAAIIIIDA1yqQIMH8w4cP9uzZM8uZM6dz0MytykYU+hRKtegxPqUsCuCqWdfCUh2qN9e1VbOuevT4lrKoVl316To0Gx4eHm737993Ydb/0ELHNGnS2Jo1a9x/+wdz/2toplsDDvVTC1LjapMcNEDRIlUd/sE8WD81eEifPr3NnTs3pFIWhX6V9qjsRnX8gcE8WP8XL15sy5YtM83Qp0yZ0rXPf8bcKx5qIwcCCCCAAAIIIPCtCyRIMFcQ1GJI3z7k+ld/NEg7fiiYquxDCxlV76xQq9lgne/7y5+Biz8VXnW0bt065t/y5cvbkCFDXPBUSYnq2RXcFY41s+vbLjG2xZ+q6dYCTi2+1Cy32qGBhEK4/6GSGbVTdePv37939fKaudeMufowePBgN8jQQESLKjXY0LXiapN2UtGAQoOUPHnyuJCu3x5oljtYP/UHkxSKVWai9mhQ4htQxPaXP58+fWo5cuSw9evXu3tphxbtPOObMQ/WfwV536Jb7VqjnWZUdqTfFqj8xUse3/oPIv1DAAEEEEAAAQTiHcxVUjF06FDbtm2bq9dWeNasuPYi1yJP1War5ENbJGqbQdU7K2gqSGt3EQXBiIgIF3BVNqLgqZ0/tF1fmzZtXAmMwqcWPaqGWwshVQ+uP0evf7XbS+/evV1phwK+wq5qsRX09fnAtqkMQrXUf/75p6sX1yz1wIED3Sx84KFrNmvWzIV2hX9fDblKRF6+fOlml3VP9U818OqXjrjapP7omirz8W0HqcCrbSKbNGkStJ8a7GjgIh/1sUKFCs5L3uvWrfu/QYXaoh1f1D6FbN1D4VzlOxrQBOu/SnO0taW2n1SJj8qENLuvWXvtsOMVD35UEUAAAQQQQACBb10g3sH8WwehfwgggAACCCCAAAIIJIUAwTwp1LknAggggAACCCCAAAIBAgRzXgkEEEAAAQQQQAABBDwgQDD3wEOgCQgggAACCCCAAAIIEMx5BxBAAAEEEEAAAQQQ8IAAwdwDD4EmIIAAAggggAACCCBAMOcdQAABBBBAAAEEEEDAAwIEcw88BJqAAAIIIIAAAggggADBnHcAAQQQQAABBBBAAAEPCBDMPfAQaAICCCCAAAIIIIAAAgRz3gEEEEAAAQQQQAABBDwgQDD3wEOgCQgggAACCCCAAAIIEMx5BxBAAAEEEEAAAQQQ8IAAwdwDD4EmIIAAAggggAACCCBAMOcdQAABBBBAAAEEEEDAAwIumEdGRkZHRUV5oDk0AQEEEEAAAQQQQACB5CkQFhZm/wNJIyNnKWN0oAAAAABJRU5ErkJggg==" />
    </div>
  );
};
