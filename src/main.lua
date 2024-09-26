Handlers.add("hello", Handlers.utils.hasMatchingTag("Action","hello"),function (msg)
   Handlers.utils.reply("hello, world")(msg)
end)
Handlers.add("data",Handlers.utils.hasMatchingTag("Action","data"),function (msg)
   local data = "You have send ".. msg.Data
   Handlers.utils.reply(data)(msg)
end)
Handlers.add("tags",Handlers.utils.hasMatchingTag("Action","tag"),function (msg)
  local data = "The Key is `carname` and the value is "..msg.Tags.carname
  Handlers.utils.reply(data)(msg)
end)
Db = Db or {}
Handlers.add("set",Handlers.utils.hasMatchingTag("Action","set"),function (msg)
  Db[msg.Tags.key] = msg.Tags.value
  local s = "Added "..msg.Tags.key.." as key and "..msg.Tags.value.." as value"
  Handlers.utils.reply(s)(msg)
end)
Handlers.add("get",Handlers.utils.hasMatchingTag("Action","get"),function (msg)
  local s = "The value for "..msg.Tags.keys.." is "..Db[msg.Tags.keys]
  Handlers.utils.reply(s)(msg)
end)