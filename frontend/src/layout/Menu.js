import * as React from 'react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
} from 'react-admin';
// MUI 
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import MovieIcon from '@material-ui/icons/Movie';
import SettingsIcon from '@material-ui/icons/Settings';
import { useMediaQuery, Box } from '@material-ui/core';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AssessmentIcon from '@material-ui/icons/Assessment';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';

import records from '../Pages/records';
import users from '../Pages/records';
import SubMenu from './SubMenu';




const Menu = ({ onMenuClick, logout, dense = false }) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const isXSmall = useMediaQuery((theme) =>
        theme.breakpoints.down('xs')
    );
    const open = useSelector((state) => state.admin.ui.sidebarOpen);
    useSelector((state) => state.theme); // force rerender on theme change

    const handleToggle = (menu) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    
    return (
        <Box mt={1}>
            <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
            <MenuItemLink
                to={`/users`}
                primaryText={translate(`resources.users.name`, {
                    smart_count: 2,
                })}
                leftIcon={<PeopleAltIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/tags`}
                primaryText={translate(`resources.tags.name`, {
                    smart_count: 2,
                })}
                leftIcon={<LocalOfferIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/medias`}
                primaryText={translate(`resources.medias.name`, {
                    smart_count: 2,
                })}
                leftIcon={<MovieIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/pendingReports`}
                primaryText={translate(`resources.pendingReports.name`, {
                    smart_count: 2,
                })}
                leftIcon={<HourglassFullIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />
            <MenuItemLink
                to={`/reports`}
                primaryText={translate(`resources.reports.name`, {
                    smart_count: 2,
                })}
                leftIcon={<AssessmentIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
                dense={dense}
            />

            {isXSmall && (
                <MenuItemLink
                    to="/configuration"
                    primaryText={translate('pos.configuration')}
                    leftIcon={<SettingsIcon />}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                    dense={dense}
                />
            )}
            {isXSmall && logout}
        </Box>
    );
};

export default Menu;