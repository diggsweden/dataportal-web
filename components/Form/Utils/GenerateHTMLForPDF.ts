import FormTypes, { TextArea } from "../FormTypes";

const renderTextAndImages = (field: TextArea) => {
  if (field.images && Object.keys(field.images).length > 0) {
    let string = field.value;

    //find string between [ and ] (should be the image name)
    const regex = /\[.*?\]/g;
    const matches = string.match(regex);

    if (matches) {
      matches.forEach((match) => {
        let imgString = match.replace(/[\[\]]/g, "");
        //if image does not exist in the images object, return.
        if (!field.images[imgString]) {
          return;
        }
        let base64img = field.images[imgString];
        string = string.replace(match, `<img src="${base64img}" alt="test" />`);
      });
    }
    return string;
  } else {
    return `<p>${field.value}</p>`;
  }
};

export const GenerateHTML = (formData: FormTypes[][]) => {
  const pageHead = `
<head>
    <style>
        @page {
            margin: 0;
            word-break: break-word;
        }

        @media print {
            @page {
                margin: 0;
            }

            body {
                margin: 1.6cm;
            }
        }
        body {
            font-family: Ubuntu,Helvetica Neue,sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 7rem;         
        }        
        th,
        td {
            text-align: left;
            padding: 8px;
            border: 1px solid black;
        }
        tr:nth-child(even) {
            background-color: hsla(0, 0%, 77%, 0.452);
        }        
        .table-cell-30 {
            width: 23%;
        }
        .right {
            text-align: right;
        }

        .left {
            text-align: left;
        }
        .container {
            width: 80vw;
            margin: 0 auto;
        }
        .answer{
            margin-bottom: 3rem;
        }

        a{
            position: absolute;
            top: 0;
            right: 0;
            margin: 1rem;
        }

        img{
          max-width: 100%;
          display: block;
          margin-bottom: 1rem;
        }

        .content{
            margin: 0;
        }

    </style>
</head>
<div>
        <h1>Förtroendemodellen</h1>
</div>
`;

  const html =
    /* Adds image to the top-right of the pdf */
    `<div class="content text-md">
    <a href="https://dataportal.se" target="_blank" rel="external noopener noreferrer">
    <img width="200px"
        src="https://diggdrstoragetest.blob.core.windows.net/strapi-dataportal2-beta/assets/illu_start_2_0_d48c342ac2.svg"
        alt="Förtroendemodellen logo badge" />
    </a>
  ` +
    formData
      .map((page) => {
        return page
          .map((field) => {
            switch (field.__typename) {
              case "dataportal_Digg_FormText":
                if (field.value.length > 0) {
                  return `
                        <div class="form-group">
                            <p><strong>${field.number}. ${field.title}</strong></p>
                            <p>${field.value}</p>
                        </div>
                        `;
                }
                return `<div class="form-group">
                                <p><strong>${field.number}. ${field.title}</strong></p>
                                <p>Inget svar</p>
                            </div>`;

              case "dataportal_Digg_FormTextArea":
                if (field.value.length > 0) {
                  return `
                        <div class="form-group">
                            <p><strong>${field.number}. ${field.title}</strong></p>
                            <p>${renderTextAndImages(field)}</p>
                        </div>
                        `;
                }
                return `<div class="form-group">
                                <p><strong>${field.number}. ${field.title}</strong></p>
                                <p>Inget svar</p>
                            </div>`;

              case "dataportal_Digg_FormRadio":
                return `<div class="form-group">
                                <p><strong>${field.number}. ${field.title}</strong></p>
                                <p><strong><i>Val: </i>${field.selected.label}</strong></p>
                                <p>${field.value}</p>
                            </div>`;

              case "dataportal_Digg_FormDescription":
                return `<h${field.TopHeading ? 2 : 3}>${field.title}</h${
                  field.TopHeading ? 2 : 3
                }>
                ${field.text.markdown}`;

              case "dataportal_Digg_FormPageBreak":
                return `<h1>${field.title}</h1>`;
            }
          })
          .join("");
      })
      .join(
        `<div style='page-break-after:always; width:100%; height:100%'></div>` //If each section should be on a new page.
      ) + '</div>'; 

  return pageHead + html;
};
