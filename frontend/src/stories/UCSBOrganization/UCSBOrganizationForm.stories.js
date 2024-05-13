import React from 'react';
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm"
import { ucsbOrganizationFixtures } from 'fixtures/ucsbOrganizationFixtures';

const componentConfig = {
    title: 'components/UCSBOrganization/UCSBOrganizationForm',
    component: UCSBOrganizationForm
};

export default componentConfig;

const Template = (args) => <UCSBOrganizationForm {...args} />;

export const Create = Template.bind({});
Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});
Update.args = {
    initialContents: ucsbOrganizationFixtures.oneOrganization,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};
