import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, ReferenceField, Edit,
    EditButton, DateField, TextInput, Create, DeleteButton,
    ReferenceInput, Filter, ArrayInput, SimpleFormIterator,
    TabbedForm, FormTab, SelectInput
} from 'react-admin';


export const RecordList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<RecordFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.type}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                    <Datagrid>
                        <TextField source="name" />
                        <TextField source="description" />
                        <ReferenceField source="tag_id" reference="tags">
                            <TextField source="name" />
                        </ReferenceField>
                        <ReferenceField source="user_id" reference="users">
                            <TextField source="name" />
                        </ReferenceField>
                        <DateField source="updatedAt" />
                        <DateField source="createdAt" />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                )}
        </List>
    );
}

const RecordFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput source="tag_id" reference="tags">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);


export const RecordCreate = (props) => (
    <Create {...props} >
        <TabbedForm redirect="list">
            <FormTab label="general">
                <TextInput source="name" />
                <TextInput source="description" />
                <ReferenceInput source="tag_id" reference="tags">
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </FormTab>
            <FormTab label="medias">
                <ArrayInput source="medias">
                    <SimpleFormIterator>
                    <ReferenceInput source="media_id" reference="medias">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </FormTab>
        </TabbedForm>
    </Create>
);




export const RecordEdit = (props) => (
    <Edit {...props}>
        <TabbedForm redirect="list">
            <FormTab label="general">
                <TextInput source="name" />
                <TextInput source="description" />
                <ReferenceInput source="tag_id" reference="tags">
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </FormTab>
            <FormTab label="medias">
                <ArrayInput source="medias">
                    <SimpleFormIterator>
                    <ReferenceInput source="media_id" reference="medias">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </FormTab>
        </TabbedForm>
    </Edit>
);

