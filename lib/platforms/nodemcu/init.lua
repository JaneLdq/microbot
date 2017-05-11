led1 = 7
gpio.mode(led1, gpio.OUTPUT)
srv=net.createServer(net.TCP)
srv:listen(8001,function(conn)  
  conn:on("receive",function(conn,request)  
    print(request)  
        local res = string.format("HTTP/1.0 200 OK\r\n"  
          .."Content-Type: text/html\r\n"  
          .."Connection: Close\r\n\r\n")
        local _, _, method, path, vars = string.find(request, "([A-Z]+) (.+)?(.+) HTTP")
        if method == nil then
            _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP")
        end
    print(method, path, vars)
    if path == '/connect' then
        print('connected')
    elseif path == '/mode' then
        gpio.mode(7, gpio.OUTPUT)
        gpio.write(7, gpio.LOW)
    elseif path == '/dw' then
        print('dw')
        gpio.mode(7, gpio.OUTPUT)
        gpio.write(7, gpio.HIGH)
    end
    conn:send(res)
  end)  
  conn:on("sent",function(conn) conn:close() end)  
end)
