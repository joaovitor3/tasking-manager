import React, { useState } from 'react';
import Select from 'react-select';
import { injectIntl } from 'react-intl';

import messages from './messages.js';
import { UserAvatar } from '../user/avatar';
import { CheckCircle } from '../checkCircle';

const Contributions = props => {
  const mappingLevels = [
    { value: 'ALL', label: props.intl.formatMessage(messages.mappingLevelALL) },
    { value: 'ADVANCED', label: props.intl.formatMessage(messages.mappingLevelADVANCED) },
    { value: 'INTERMEDIATE', label: props.intl.formatMessage(messages.mappingLevelINTERMEDIATE) },
    { value: 'BEGINNER', label: props.intl.formatMessage(messages.mappingLevelBEGINNER) },
  ];

  const [level, setLevel] = useState(mappingLevels[0]);
  const [activeStatus, setActiveStatus] = useState(null);

  const MappingLevelSelect = () => {
    return (
      <Select
        isClearable={false}
        options={mappingLevels}
        onChange={value => setLevel(value)}
        className="w-30 fr mb3"
        value={level}
      />
    );
  };

  const displayTasks = (taskIds, status) => {
    if (activeStatus === status) {
      props.setSelectedTasks([]);
      setActiveStatus(null);
    } else {
      let filteredTasksByStatus = props.tasks.features;
      if (status === 'MAPPED') {
        filteredTasksByStatus = filteredTasksByStatus.filter(
          task => task.properties.taskStatus === 'MAPPED',
        );
      }
      if (status === 'VALIDATED') {
        filteredTasksByStatus = filteredTasksByStatus.filter(
          task => task.properties.taskStatus === 'VALIDATED',
        );
      }
      const ids = filteredTasksByStatus
        .filter(t => taskIds.includes(t.properties.taskId))
        .map(f => f.properties.taskId);
      props.setSelectedTasks(ids);
      setActiveStatus(status);
    }
  };

  let contributionsArray = props.contribsData[2].userContributions;
  if (level.value !== 'ALL') {
    contributionsArray = contributionsArray.filter(u => u.mappingLevel === level.value);
  }

  return (
    <div className="w-100 f5 pr4 cf">
      <div className="w-100 fr cf">
        <MappingLevelSelect />
      </div>
      <div className="w-100 fl cf">
        {contributionsArray.map(user => {
          return (
            <div className="w-100 cf pa3 ba b--tan mb2">
              <div className="w-40 fl dib">
                <UserAvatar picture={user.pictureUrl} username={user.username} />
                <a
                  className="blue-dark mr2"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`/users/${user.username}`}
                >
                  {user.username}
                </a>{' '}
                <span className="f7 ttl">
                  ({props.intl.formatMessage(messages[`mappingLevel${user.mappingLevel}`])})
                </span>
              </div>
              <div
                className="w-20 fl tr dib pointer pt2"
                onClick={() => displayTasks(user.taskIds, 'MAPPED')}
              >
                <span className="mr1 b self-start">{user.mapped}</span>
                <span className="ttl mr2">{props.intl.formatMessage(messages.mapped)}</span>
                <CheckCircle
                  className={`${
                    activeStatus === 'MAPPED' ? 'bg-blue-dark' : 'bg-grey-light'
                  } white`}
                />
              </div>
              <div
                className="w-20 fl tr dib pointer pt2"
                onClick={() => displayTasks(user.taskIds, 'VALIDATED')}
              >
                <span className="mr1 b">{user.validated}</span>
                <span className="ttl mr2">{props.intl.formatMessage(messages.validated)}</span>
                <CheckCircle
                  className={`${
                    activeStatus === 'VALIDATED' ? 'bg-blue-dark' : 'bg-grey-light'
                  } white`}
                />
              </div>
              <div
                className="w-20 fl tr dib pointer pt2"
                onClick={() => displayTasks(user.taskIds, 'ALL')}
              >
                <span className="mr1 b">{user.total}</span>
                <span className="ttl mr2">{props.intl.formatMessage(messages.total)}</span>
                <CheckCircle
                  className={`${activeStatus === 'ALL' ? 'bg-blue-dark' : 'bg-grey-light'} white`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default injectIntl(Contributions);
