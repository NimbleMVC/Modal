<?php

namespace NimblePHP\Modal\Middlewares;

use NimblePHP\Framework\Exception\NimbleException;
use NimblePHP\Framework\Middleware\Abstracts\AbstractControllerMiddleware;
use NimblePHP\Framework\Middleware\Interfaces\ControllerMiddlewareInterface;
use ReflectionMethod;

class ModalMiddleware extends AbstractControllerMiddleware implements ControllerMiddlewareInterface
{

    /**
     * Per-controller modal state
     * @var array<int, array>
     */
    protected static array $state = [];

    /**
     * Ensure controller modal state exists
     * @param object $controller
     * @return void
     */
    public static function initController(object $controller): void
    {
        $id = spl_object_id($controller);

        if (isset(self::$state[$id])) {
            return;
        }

        self::$state[$id] = [
            'dirty' => false,
            'config' => [
                'title' => null,
                'size' => null,
                'fullscreen' => false,
                'menu' => [],
                'class' => [
                    'body' => '',
                    'modal' => '',
                    'content' => ''
                ]
            ]
        ];
    }

    /**
     * @param object $controller
     * @return int
     */
    protected static function getControllerId(object $controller): int
    {
        return spl_object_id($controller);
    }

    /**
     * @param object $controller
     * @return array
     */
    protected static function &getState(object $controller): array
    {
        self::initController($controller);

        $id = self::getControllerId($controller);
        return self::$state[$id];
    }

    /**
     * @param object $controller
     * @return array
     */
    public static function getConfig(object $controller): array
    {
        $state = &self::getState($controller);
        return $state['config'];
    }

    /**
     * @param object $controller
     * @param string $name
     * @return void
     */
    public static function setModalTitle(object $controller, string $name): void
    {
        $state = &self::getState($controller);
        $state['config']['title'] = $name;
        $state['dirty'] = true;
    }

    /**
     * @param object $controller
     * @param string $size
     * @return void
     * @throws NimbleException
     */
    public static function setModalSize(object $controller, string $size): void
    {
        if (!in_array($size, ['xl', 'lg', 'sm'], true)) {
            throw new NimbleException('Avaliable modal size: xl, lg, sm', 500);
        }

        $state = &self::getState($controller);
        $state['config']['size'] = $size;
        $state['dirty'] = true;
    }

    /**
     * @param object $controller
     * @param bool $fullscreen
     * @return void
     */
    public static function setModalFullscreen(object $controller, bool $fullscreen): void
    {
        $state = &self::getState($controller);
        $state['config']['fullscreen'] = $fullscreen;
        $state['dirty'] = true;
    }

    /**
     * @param object $controller
     * @param string $name
     * @param string $url
     * @param string $class
     * @return void
     */
    public static function addModalMenuAction(object $controller, string $name, string $url = '#', string $class = ''): void
    {
        $state = &self::getState($controller);
        $state['config']['menu'][] = [
            'name' => $name,
            'url' => $url,
            'class' => $class
        ];
        $state['dirty'] = true;
    }

    /**
     * @param object $controller
     * @param string $name
     * @param string $classes
     * @return void
     */
    public static function setModalClass(object $controller, string $name, string $classes): void
    {
        $state = &self::getState($controller);

        if (!array_key_exists($name, $state['config']['class'])) {
            $state['config']['class'][$name] = '';
        }

        $state['config']['class'][$name] = $classes;
        $state['dirty'] = true;
    }

    /**
     * @param object $controller
     * @return void
     */
    public static function renderModalConfigHeader(object $controller): void
    {
        $state = &self::getState($controller);

        if (!headers_sent()) {
            header('X-Modal-Config: ' . base64_encode((string)json_encode($state['config'])));
        }

        $state['dirty'] = false;
    }

    /**
     * @param ReflectionMethod $reflection
     * @param object $controller
     * @return void
     */
    public function afterAttributesController(ReflectionMethod $reflection, object $controller): void
    {
        self::initController($controller);
    }

    /**
     * @param object $controller
     * @param string $controllerName
     * @param string $methodName
     * @param array $params
     * @return void
     */
    public function afterControllerDispatch(object $controller, string $controllerName, string $methodName, array $params): void
    {
        $state = &self::getState($controller);

        if ($state['dirty']) {
            self::renderModalConfigHeader($controller);
        }

        unset(self::$state[self::getControllerId($controller)]);
    }

}
