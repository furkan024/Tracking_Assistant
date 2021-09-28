import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, EditButton, ImageField, Filter,
    DateField, Create, TabbedForm, TextInput, Edit, FormTab, PasswordInput, ImageInput,
    SelectInput
} from 'react-admin';
import { Field } from 'react-final-form';

export const UserList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<UserFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        <TextField source="email" />
                        <DateField source="createdAt" />
                        <DateField source="updatedAt" />
                        <EditButton />
                    </Datagrid>
                )}
        </List>
    );
}

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="main">
                <TextInput source="name" />
                <TextInput source="email" />
                <PasswordInput source="password" />

                <ImageInput source="pictures" label="Related pictures" accept="image/*" multiple={true}>
                    <ImageField source="src" title="title" />
                </ImageInput>
                <SelectInput source="role" choices={[
                    { id: 'admin', name: 'Admin' },
                    { id: 'teacher', name: 'Teacher' },
                    { id: 'student', name: 'Student' },
                ]} />
            </FormTab>
        </TabbedForm>
    </Create>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="main">
                <TextInput source="name" />
                <TextInput source="email" />
                <PasswordInput source="password" />
                <ImageInput source="pictures" label="Profile picture" accept="image/*" multiple={true} >
                    <ImageField source="src" />
                </ImageInput>
                <SelectInput source="role" choices={[
                    { id: 'admin', name: 'Admin' },
                    { id: 'teacher', name: 'Teacher' },
                    { id: 'student', name: 'Student' },
                ]} />
            </FormTab>
        </TabbedForm>
    </Edit>
);