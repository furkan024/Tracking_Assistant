import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:4000/api';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('Access-Control-Allow-Origin', '*');
    const { token } = JSON.parse(localStorage.getItem('auth'));
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider(apiUrl, httpClient);



const myDataProvider = {
    ...dataProvider,
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        
        console.log(query)
        return dataProvider.getList(resource, params)
    },
    create: (resource, params) => {

        if (resource === 'tags' ) {
            // Create by userId
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.data = { ...params.data, 'user_id': user_id };
            return dataProvider.create(resource, params);
        }
        else if (resource === 'records' || params.data.files) {
            // Freshly dropped pictures are File objects and must be converted to base64 strings
            const newfiles = params.data.files.filter(
                p => p.rawFile instanceof File
            );
            const formerfiles = params.data.files.filter(
                p => !(p.rawFile instanceof File)
            );
            
            // Create by userId
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.data = { ...params.data, 'user_id': user_id };
            
            return Promise.all(newfiles.map(convertFileToBase64))
                .then(base64files =>
                    base64files.map(file64 => ({
                        src: file64,
                        title: `${params.data.files[0].rawFile.name}`,
                    }))
                )
                .then(transformedNewfiles =>
                    dataProvider.create(resource, {
                        ...params,
                        data: {
                            ...params.data,
                            files: [
                                ...transformedNewfiles,
                                ...formerfiles,
                            ],
                        },
                    })
                );
        }
        else {
            // fallback to the default implementation
            return dataProvider.create(resource, params);
        }

    },
    update: (resource, params) => {
        if (resource !== 'records' || !params.data.files) {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }
        /**
         * For posts update only, convert uploaded image in base 64 and attach it to
         * the `picture` sent property, with `src` and `title` attributes.
         */

        // Freshly dropped pictures are File objects and must be converted to base64 strings
        const newfiles = params.data.files.filter(
            p => p.rawFile instanceof File
        );
        const formerfiles = params.data.files.filter(
            p => !(p.rawFile instanceof File)
        );

        console.log('params Create ==> ', newfiles)
        return Promise.all(newfiles.map(convertFileToBase64))
            .then(base64files =>
                base64files.map(file64 => ({
                    src: file64,
                    title: `${params.data.files[0].title}`,
                }))
            )
            .then(transformedNewfiles =>
                dataProvider.update(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        files: [
                            ...transformedNewfiles,
                            ...formerfiles,
                        ],
                    },
                })
            );
    },
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });

export default myDataProvider;