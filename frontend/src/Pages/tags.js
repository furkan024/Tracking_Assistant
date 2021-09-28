import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, ReferenceField, Edit,
    EditButton, DateField, TextInput, Create,
    ReferenceInput, TabbedForm, FormTab,
    SimpleFormIterator, ArrayInput, Filter, SelectInput
} from 'react-admin';

export const TagList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<TagFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.description}
                    tertiaryText={record => record.user_id}
                />
            ) : (
                    <Datagrid>
                        <TextField source="name" />
                        <TextField source="description" />
                        <ReferenceField source="user_id" reference="users">
                            <TextField source="name" />
                        </ReferenceField>
                        <DateField source="updatedAt" />
                        <DateField source="createdAt" />
                        <EditButton />
                    </Datagrid>
                )}
        </List>
    );
}

const TagFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput source="user_id" reference="users">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const TagEdit = (props) => (
    <Edit {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="general">
                <TextInput source="name" />
                <TextInput source="description" />
            </FormTab>
            <FormTab label="participants">
                <ArrayInput source="participants">
                    <SimpleFormIterator>
                        <ReferenceInput
                            source="user_id"
                            reference="users"
                        >
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </FormTab>
        </TabbedForm>
    </Edit>
);

export const TagCreate = (props) => (
    <Create {...props} >
        <TabbedForm redirect='list'>
            <FormTab label="general">
                <TextInput source="name" />
                <TextInput source="description" />
            </FormTab>
            <FormTab label="participants">
                <ArrayInput source="participants">
                    <SimpleFormIterator>
                        <ReferenceInput
                            source="user_id"
                            reference="users"
                        >
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </FormTab>
        </TabbedForm>
    </Create>
);