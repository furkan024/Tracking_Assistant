import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, ReferenceField, Edit,
    EditButton, DateField, TextInput, Create, SimpleForm, DeleteButton,
    ReferenceInput, Filter, FileField, FileInput,
    TabbedForm, FormTab, SelectInput
} from 'react-admin';
// Components
import FileUpload from '../components/FileUpload';
import PreviewButton from '../components/PreviewButton'
import GetReport from "../components/GetReport";

export const MediaList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<MediaFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.type}
                    tertiaryText={record => record.createdAt}
                />
            ) : (
                    <Datagrid>
                        <TextField source="name" />
                        <ReferenceField source="tag_id" reference="tags" label="Lesson">
                            <TextField source="name" />
                        </ReferenceField>
                        <DateField source="updatedAt" />
                        <DateField source="createdAt" />
                        <PreviewButton />
                        <GetReport />
                        <DeleteButton />
                    </Datagrid>
                )}
        </List>
    );
}

const MediaFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);


export const MediaCreate = (props) => (
    <Create {...props} >
        <TabbedForm>
            <FormTab label="general">
                <FileUpload />
            </FormTab>
        </TabbedForm>
    </Create>
);




