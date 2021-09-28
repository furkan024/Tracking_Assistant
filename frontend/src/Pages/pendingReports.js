import * as React from "react";
import { useMediaQuery } from '@material-ui/core';
import {
    List, SimpleList, Datagrid, TextField, EditButton, Filter,
    DateField, Create, TabbedForm, TextInput, Edit, FormTab, BooleanField,
    ReferenceField, ReferenceInput, BooleanInput, SelectInput, DeleteButton
} from 'react-admin';
import GetResult from '../components/GetResult';

export const PendingReportList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props} filters={<PendingReportFilter />}>
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
                        <DateField source="lecture_date" />

                        <ReferenceField source="media_id" reference="medias">
                            <TextField source="name" />
                        </ReferenceField>
                        <GetResult />
                        <DeleteButton />
                    </Datagrid>
                )}
        </List>
    );
}

const PendingReportFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <ReferenceInput source="user_id" reference="users">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput source="tag_id" reference="tags" label="Lesson">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);



export const PendingReportEdit = (props) => (
    <Edit {...props}>
        <TabbedForm redirect='list'>
            <FormTab label="main">
                <ReferenceInput source="user_id" reference="users">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="tag_id" reference="tags" label="Lesson">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <ReferenceInput source="media_id" reference="medias">
                    <SelectInput optionText="name" />
                </ReferenceInput>
            </FormTab>
        </TabbedForm>
    </Edit>
);