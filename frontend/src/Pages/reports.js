import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, EditButton, Filter,
    DateField, Create, TabbedForm, TextInput, Edit, FormTab, BooleanField,
    ReferenceField, ReferenceInput, BooleanInput, SelectInput, DeleteButton
} from 'react-admin';

export const ReportList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<ReportFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                    <Datagrid>
                        <ReferenceField source="user_id" reference="users">
                            <TextField source="name" />
                        </ReferenceField>
                        <ReferenceField source="tag_id" reference="tags" label="Lesson">
                            <TextField source="name" />
                        </ReferenceField>

                        <ReferenceField source="media_id" reference="medias">
                            <TextField source="name" />
                        </ReferenceField>
                        <BooleanField source="identification" />
                        {/*<TextField source="cheater" /> */}
                        <TextField source="attentive" />
                        <TextField source="careless" />
                        <TextField source="no_face" />
                        <DateField source="lecture_date" />
                        <DateField source="createdAt" />
                        <DeleteButton />
                    </Datagrid>
                )}
        </List>
    );
}

const ReportFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput source="user_id" reference="users">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput source="record_id" reference="records">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const ReportCreate = (props) => (
    <Create {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="main">
                <ReferenceInput source="tag_id" reference="tags">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="user_id" reference="users">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="record_id" reference="records">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="media_id" reference="medias">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <BooleanInput source="attendance" />
                <TextInput source="cheater" />
                <TextInput source="careless" />
                <TextInput source="attentive" />
            </FormTab>
        </TabbedForm>
    </Create>
);

export const ReportEdit = (props) => (
    <Edit {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="main">
                <ReferenceInput source="user_id" reference="users">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="record_id" reference="records">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <BooleanInput source="attendance" />
                <TextInput source="cheater" />
                <TextInput source="careless" />
                <TextInput source="attentive" />
            </FormTab>
        </TabbedForm>
    </Edit>
);