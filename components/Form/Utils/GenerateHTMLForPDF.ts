import FormTypes from '../FormTypes';

export const GenerateHTML = (
  formData: (FormTypes)[][]
) => {
  const pageHead = `
<head>
    <style>
        @page {
            margin: 0;
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
            font-family: Arial, Helvetica, sans-serif;
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
    </style>
</head>
<div>
        <h1>Förtroendemodellen</h1>
</div>
`;

  const html = formData
    .map((page) => {
      return page
        .map((field) => {
          switch (field.__typename) {
            case 'dataportal_Digg_FormText':
              if (field.value.length > 0) {
                return `
                        <div class="form-group">
                            <p><strong>${field.title}</strong></p>
                            <p>${field.value}</p>
                        </div>
                        `;
              }
              return `<div class="form-group">
                                <p><strong>${field.title}</strong></p>
                                <p>Inget svar</p>
                            </div>`;
            case 'dataportal_Digg_FormTextArea':
              if (field.value.length > 0) {
                return `
                        <div class="form-group">
                            <p><strong>${field.title}</strong></p>
                            <p>${field.value}</p>
                        </div>
                        `;
              }
              return `<div class="form-group">
                                <p><strong>${field.title}</strong></p>
                                <p>Inget svar</p>
                            </div>`;
            case 'dataportal_Digg_FormRadio':
              return `<div class="form-group">
                                <p><strong>${field.title}</strong></p>
                                <p><strong>${field.selected.label}</strong> ${field.value.length > 0 ? `- ${field.value}` : ''}</p>
                            </div>`;
            case 'dataportal_Digg_FormDescription':
              return `<h${field.TopHeading ? 2 : 3}>${field.title}</h${
                field.text.length === 1 ? 2 : 3
              }>`;

            case 'dataportal_Digg_FormPageBreak':
              return `<h1>${field.title}</h1>`;
          }
        })
        .join('');
    })
    .join(`<div style='page-break-after:always; width:100%; height:100%'></div>`); //If each section should be on a new page.

  return pageHead + html;
};
