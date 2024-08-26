// 责任链模式的核心思想是：多个处理者形成一个链，每个处理者负责处理特定的任务，并可以将任务传递给下一个处理者。你可以把它想象成一系列接力赛选手，每个人都负责完成某一部分任务，完成后把任务交给下一个人。
class Handler {
  constructor(next) {
    this.next = next; // 下一个处理器
  }

  handle(request) {
    // 当前处理器的处理逻辑
    if (this.next) {
      this.next.handle(request); // 传递给下一个处理器
    }
  }
}

class LogHandler extends Handler {
  handle(request) {
    if (request.type === "log") {
      console.log("Logging request:", request.message);
    } else {
      super.handle(request); // 不处理，传给下一个处理器
    }
  }
}

class AuthHandler extends Handler {
  handle(request) {
    if (request.type === "auth") {
      console.log("Authenticating request:", request.message);
    } else {
      super.handle(request); // 不处理，传给下一个处理器
    }
  }
}

class DataHandler extends Handler {
  handle(request) {
    if (request.type === "data") {
      console.log("Handling data request:", request.message);
    } else {
      super.handle(request); // 不处理，传给下一个处理器
    }
  }
}

// 创建处理器链
const handlerChain = new LogHandler(new AuthHandler(new DataHandler(null)));

// 发送不同的请求
handlerChain.handle({ type: "log", message: "User logged in" });
handlerChain.handle({ type: "auth", message: "User authentication" });
handlerChain.handle({ type: "data", message: "Fetching user data" });

/*
Logging request: User logged in
Authenticating request: User authentication
Handling data request: Fetching user data

LogHandler 负责处理日志类请求。
AuthHandler 负责处理认证类请求。
DataHandler 负责处理数据类请求。
每个处理器只处理自己关心的任务，其他任务会传递给链中的下一个处理器。如果没有下一个处理器，任务就终止处理。
*/