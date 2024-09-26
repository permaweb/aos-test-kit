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