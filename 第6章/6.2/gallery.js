(function () {
    var $gallery = document.querySelector(".gallery");
    $gallery.addEventListener("click", function (e) {
        // 监听单击事件，切换相册的CSS class来实现预览和普通模式的切换
        var classList = $gallery.classList,
            css_preview = "preview";
        if (classList.contains(css_preview)) {
            classList.remove(css_preview) 
            // 在非预览模式下，相册的宽度为100vw
            $gallery.style.width = 100 + "vw"
        } else {
            classList.add(css_preview);
            // 在预览模式下，所有的图片横着拍成一排，相册的总宽度为每一个项目长度总和。
            $gallery.style.width = 100 * itemsLength + "vw"
        }
    });

    var isTtouchstart = false,
        startOffsetX,
        currentTranX = 0,
        width = $gallery.offsetWidth,
        $items = $gallery.querySelectorAll(".item"),
        itemsLength = $items.length,
        move = function (dx) {
            $gallery.style.transform = "translate(" + dx + "px, 0)";
        };

    $gallery.addEventListener("touchstart", function (e) {
        // 触摸开始时，记住当前手指的位置
        startOffsetX = e.changedTouches[0].pageX;
        // 
        $gallery.classList.remove("animation");
    });

    $gallery.addEventListener("touchmove", function (e) {
        isTtouchstart = true;
        // 计算手指的水平移动量
        var dx = e.changedTouches[0].pageX - startOffsetX;
        // 调用move方法，设置galley元素的transform，移动图片
        move(currentTranX + dx);
    });

    $gallery.addEventListener("touchend", function (e) {
        if (isTtouchstart) {
            // 在移动图片的时候，需要动画，动画采用CSS3的transition实现。
            $gallery.classList.add("animation");
            // 计算偏移量
            var dx = e.changedTouches[0].pageX - startOffsetX;
            // 如果偏移量超出gallery宽度的一半
            if (Math.abs(dx) > width / 2) {
                // 处理临界值
                if (currentTranX <= 0 && currentTranX > -width * itemsLength) {
                    // 如果手指向右滑动
                    if (dx > 0) {
                        // 如果图片不是显示第一张
                        if (currentTranX < 0) {
                            currentTranX = currentTranX + width;
                        }
                    //  如果手指向右滑动，并且当前图片不是显示最后一张
                    } else if (currentTranX > -width * (itemsLength - 1)) {
                        currentTranX = currentTranX - width;
                    }
                }
            }
            // 如果未超出图片宽度的一半，上述条件不会执行，而这个时候，手指在移动的时候，图片随着手指移动了，通过下面的代码，将图片的位置还原
            // 如果超出了图片宽度的一半，将切换到上一张／下一张图片
            move(currentTranX);
        }
        isTtouchstart = false;
    });
} ())
