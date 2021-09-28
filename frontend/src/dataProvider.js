import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:4000/api';


const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });

    }

    const { token } = JSON.parse(localStorage.getItem('auth'));
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};




export default {
    getList: (resource, params) => {
        if (resource === 'medias') {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.filter = {'user_id': user_id};
            const query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                filter: JSON.stringify(params.filter),
            };

            const url = `${apiUrl}/${resource}?${stringify(query)}`;
    
            return httpClient(url).then(({ headers, json }) => ({
                data: json,
                total: 10,
            }));
            
        }
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: 10,
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };

        const url = `${apiUrl}/${resource}/many?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: 10
        }));
    },

    update: (resource, params) => {
        
        if (resource === 'records') {
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.data = { ...params.data, 'user_id': user_id };
            console.log(params.data);
            return httpClient(`${apiUrl}/${resource}/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            }).then(({ json }) => ({ data: json }))
        }
        else {
            return httpClient(`${apiUrl}/${resource}/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            }).then(({ json }) => ({ data: json }))
        }

    },

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) => {
       
        if (resource === 'users' || params.data.pictures) {
            console.log('users if', params.data)
            const newPictures = params.data.pictures.filter(
                p => p.rawFile instanceof File
            );
            const formerPictures = params.data.pictures.filter(
                p => !(p.rawFile instanceof File)
            );

            return Promise.all(newPictures.map(convertFileToBase64))
                .then(base64Pictures =>
                    base64Pictures.map(picture64 => ({
                        src: picture64,
                        title: newPictures[0].title,
                    }))
                )
                .then(transformedNewPictures => {
                    return httpClient(`${apiUrl}/${resource}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            ...params.data,
                            pictures: [
                                ...transformedNewPictures,
                                ...formerPictures
                            ]
                        }),
                    }).then(({ json }) => ({
                        data: { ...params.data, id: json.id },
                    }))
                });
        }
         /*
        else if (resource === 'records' ) {
            console.log('records if')
            console.log('params', params.data);
            const NewFiles = params.data.files.filter(
                p => p.rawFile instanceof File
            );
            const formerFiles = params.data.files.filter(
                p => !(p.rawFile instanceof File)
            );
            // Create by userId
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.data = { ...params.data, 'user_id': user_id };

            return Promise.all(NewFiles.map(convertFileToBase64))
                .then(base64Files =>
                    base64Files.map(file64 => ({
                        src: file64,
                        title: `${params.data.title}`,
                    }))
                )
                .then(transformedNewFiles => {
                    return fetchUtils.fetchJson(`${apiUrl}/${resource}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' } ,
                        body: JSON.stringify({
                            ...params.data,
                            files: [
                                ...transformedNewFiles,
                                ...formerFiles
                            ]
                        }),
                    }).then(({ json }) => ({
                        data: { ...params.data, id: json.id },
                    }))
                });
        }
        */
        else if (resource === 'tags') {
            // Create by userId
            const user_id = JSON.parse(localStorage.getItem('auth')).userId;
            params.data = { ...params.data, 'user_id': user_id };
            console.log(params);
            return httpClient(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(params.data),
            }).then(({ json }) => ({
                data: { ...params.data, id: json.id },
            }))
        }
        
        else {
            console.log('else ')
            return httpClient(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(params.data),
            }).then(({ json }) => ({
                data: { ...params.data, id: json.id },
            }))
        }
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
};

const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });