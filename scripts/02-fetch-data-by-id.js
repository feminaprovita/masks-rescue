const fs = require('fs')
const {google} = require('googleapis')
const c = require('../credentials')

const p = google.plus({version: 'v1', auth: c})

const parseIndividualCommentItem = (item) => {
  return {
    id: item.id,
    url: item.selfLink,
    published: item.published,
    updated: item.updated,
    authorId: item.actor.id,
    authorDisplayName: item.actor.displayName,
    content: item.object.content,
  }
}

const parseComments = async (activityId) => {
  let commentList = (await p.comments.list({activityId})).data.items
  return commentList.map(i => parseIndividualCommentItem(i))
}

const parseActivity = async (activityId) => {

  let activityData = (await p.activities.get({activityId})).data
  let comments = []
  if (activityData.object.replies.totalItems > 0)
    comments = await parseComments(activityId)

  return {
    category: activityData.access.description,
    published: activityData.published,
    updated: activityData.updated,
    authorId: activityData.actor.id,
    authorDisplayName: activityData.actor.displayName,
    comments,
    title: activityData.object.title,
    content: activityData.object.content,
    id: activityData.id,
    url: activityData.object.url,
    attachments: activityData.object.attachments,
  }
}

const getAllActivities = async (activityList) => {
  let out = []
  for (let i = 0; i < activityList.length; i++){
    let parsed = await parseActivity(activityList[i])
    if (i === 0) console.log(JSON.stringify(parsed, undefined, 2)
    out.push(parsed)
  }
  return out
}

module.exports = getAllActivities
